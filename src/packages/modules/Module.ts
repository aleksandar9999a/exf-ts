export function ExFModule({ components }: { components: any[] }) {
  components = components.reduce((acc, cmp) => {
    acc[cmp.selector] = cmp;
    return acc;
  }, {});
  return components;
}