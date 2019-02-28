export default function checkProps(props) {
  if (!props.list) {
    throw new Error('props.list is required');
  }

  if (!props.nestedPropName) {
    throw new Error('props.nestedPropName is required');
  }
}
