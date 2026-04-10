import ArrayVisualizer from './ArrayVisualizer'
import StackVisualizer from './StackVisualizer'
import LinkedListVisualizer from './LinkedListVisualizer'
import SearchVisualizer from './SearchVisualizer'
import TreeVisualizer from './TreeVisualizer'
import GraphVisualizer from './GraphVisualizer'
import RecursionVisualizer from './RecursionVisualizer'

const VISUALIZER_MAP = {
  'array':       ArrayVisualizer,
  'stack':       StackVisualizer,
  'linked_list': LinkedListVisualizer,
  'binary-search': SearchVisualizer,
  'linear-search': SearchVisualizer,
  'tree':        TreeVisualizer,
  'graph':       GraphVisualizer,
  'recursion':   RecursionVisualizer,
}

export default VISUALIZER_MAP