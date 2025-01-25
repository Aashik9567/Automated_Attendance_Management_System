**vendor**

Vendored dependencies for **antv** (inspired by [VictoryVendor](https://github.com/FormidableLabs/victory/tree/main/packages/victory-vendor))

```shell
npm i @antv/vendor
```

Recommend to use bun to install and run this project

📢: You need to prepack and link module-resolver to vendor before run build scripts

**quick start**

```shell
bun install

# link module-resolver to vendor
cd module-resolver && bun link && cd .. && bun link module-resolver

# run build script
bun run scripts/build.ts
```

**notification**: The following packages have no @types

- d3-regression
- d3-geo-projection
- d3-force-3d
