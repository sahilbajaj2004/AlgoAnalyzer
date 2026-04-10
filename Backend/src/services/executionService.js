// ─── Provider-agnostic execution service ─────────────────────────────────────
// To switch providers, just change EXECUTION_PROVIDER in your .env:
//   EXECUTION_PROVIDER=jdoodle   (default)
//   EXECUTION_PROVIDER=judge0
//   EXECUTION_PROVIDER=piston

const PROVIDERS = {
  jdoodle: () => require('./providers/jdoodle'),
  judge0:  () => require('./providers/judge0'),
  piston:  () => require('./providers/piston'),
};

const getProvider = () => {
  const name     = (process.env.EXECUTION_PROVIDER || 'jdoodle').toLowerCase();
  const factory  = PROVIDERS[name];
  if (!factory) {
    console.warn(`Unknown provider "${name}", falling back to jdoodle`);
    return require('./providers/jdoodle');
  }
  return factory();
};

// ─── Wrap user's method in a runnable Java class ──────────────────────────────
const wrapJavaCode = (code, input) => {
  // Full class — run as-is
  if (code.includes('public static void main')) return code;

  let inputArray;
  try {
    inputArray = Array.isArray(input) ? input : JSON.parse(input);
  } catch {
    inputArray = [5, 3, 8, 1, 9, 2];
  }

  const arrayLiteral = `{${inputArray.join(', ')}}`;

  return `
import java.util.*;
import java.lang.reflect.*;

public class Main {

    ${code}

    public static void main(String[] args) {
        int[] arr = ${arrayLiteral};
        long start = System.nanoTime();

        Main m = new Main();
        Object result = null;
        try {
            Method[] methods = Main.class.getDeclaredMethods();
            for (Method method : methods) {
                if (method.getName().equals("main")) continue;
                Class<?>[] params = method.getParameterTypes();
                method.setAccessible(true);

                // int[] — sorting/searching
                if (params.length == 1 && params[0] == int[].class) {
                    result = method.invoke(m, (Object) arr);
                    break;
                }
                // int[], int — search with target
                if (params.length == 2 && params[0] == int[].class && params[1] == int.class) {
                    result = method.invoke(m, arr, arr[arr.length / 2]); // use middle as target
                    break;
                }
                // int — single value (factorial, fibonacci etc.)
                if (params.length == 1 && params[0] == int.class) {
                    result = method.invoke(m, arr[0]);
                    break;
                }
            }
        } catch (Exception e) {
            System.out.println("ERROR: " + (e.getCause() != null ? e.getCause().getMessage() : e.getMessage()));
        }

        long end = System.nanoTime();
        double ms = (end - start) / 1_000_000.0;

        // Show result or array state
        if (result != null) {
            System.out.println("Output: " + result);
        } else {
            System.out.println("Output: " + Arrays.toString(arr));
        }
        System.out.printf("Time: %.3f ms%n", ms);
        System.out.println("N: " + arr.length);
    }
}
`;
};

// ─── Main execute function ────────────────────────────────────────────────────
const executeCode = async (code, language = 'java', input = [5, 3, 8, 1, 9, 2]) => {
  try {
    const provider    = getProvider();
    const wrappedCode = language === 'java' ? wrapJavaCode(code, input) : code;
    const { stdout, memory } = await provider.execute(wrappedCode, language);

    const timeMatch   = stdout.match(/Time:\s*([\d.]+)\s*ms/);
    const outputMatch = stdout.match(/Output:\s*(\[.*?\])/);
    const nMatch      = stdout.match(/N:\s*(\d+)/);
    const errorMatch  = stdout.match(/ERROR:\s*(.+)/);

    return {
      success:           !errorMatch,
      status:            errorMatch ? 'Runtime Error' : 'Accepted',
      stdout,
      stderr:            errorMatch ? errorMatch[1] : '',
      execution_time_ms: timeMatch   ? parseFloat(timeMatch[1]) : null,
      memory_kb:         memory,
      output:            outputMatch ? outputMatch[1]           : null,
      input_size:        nMatch      ? parseInt(nMatch[1])      : (Array.isArray(input) ? input.length : 0),
      provider:          process.env.EXECUTION_PROVIDER || 'jdoodle',
    };

  } catch (err) {
    console.error(`[${process.env.EXECUTION_PROVIDER || 'jdoodle'}] error:`, err.message);
    return {
      success:           false,
      status:            'Error',
      stdout:            '',
      stderr:            err.message,
      execution_time_ms: null,
      memory_kb:         null,
      output:            null,
      input_size:        Array.isArray(input) ? input.length : 0,
      provider:          process.env.EXECUTION_PROVIDER || 'jdoodle',
    };
  }
};

module.exports = { executeCode };