# SnapDiff

> Quickly snapshot and diff database tables.

WARNING: This application is currently in pre-release state.

### Limitations

* Snapshot size is currently limited to 1000 rows.  Tables of greater sizes cannot currently be snapshotted or diffed.  [See issue #8](https://github.com/codelaor/snapdiff/issues/8).
* ***Please Note:*** SnapDiff is not a production database support tool but an application development utility.  Snapshotting takes place while the database is live and recieving concurrent updates and for this reason cannot be relied upon in a multi-user environment.

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:9080
npm run dev

# build electron app for production
npm run build

# lint all JS/Vue component files in `app/src`
npm run lint

# run webpack in production
npm run pack
```
More information can be found [here](https://simulatedgreg.gitbooks.io/electron-vue/content/docs/npm_scripts.html).

---

This project was generated from [electron-vue](https://github.com/SimulatedGREG/electron-vue) using [vue-cli](https://github.com/vuejs/vue-cli). Documentation about this project can be found [here](https://simulatedgreg.gitbooks.io/electron-vue/content/index.html).
