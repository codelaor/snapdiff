<template>
  <div class="container">
    <page-header :title="`Database '${databaseTitle}'`"/>
    <div class="column">
      <p v-if="!tables.length">
        No tables found in 'database' {{ databaseTitle }} (system tables are excluded.)
      </p>
      <table class="snapdiff-data-table" v-if="tables.length">
        <colgroup>
          <col span="1" v-if="client.hasSchemas" style="width: 15%;">
          <col span="1">
          <col span="1" style="width: 15%;">
          <col span="1" style="width: 15%;">
        </colgroup>
        <tr>
          <th v-if="client.hasSchemas">
            Schema
          </th>
          <th>
            Name
          </th>
          <th>
            Snapshots 
            <button @click="createSnapshots" title="Create new snapshot for all tables">
              <icon name="clone"/>
            </button>
          </th>
          <th>
            Diff 
            <button @click="diffLatestSnapshots" title="Diff current data against latest snapshot">
              <icon name="balance-scale"/>
            </button>
          </th>
        </tr>
        <tr v-for="table in tables">
          <td v-if="client.hasSchemas">
            {{ table.schema }}
          </td>
          <td>
            <router-link v-if="table.schema" v-bind:to="`/schema/${table.schema}/table/${table.name}`">{{ table.name }}</router-link>
            <router-link v-if="!table.schema" v-bind:to="`/table/${table.name}`">{{ table.name }}</router-link>
          </td>
          <td>
            <span v-if="table.snapshots.length">
              <router-link v-if="table.schema" v-bind:to="`/schema/${table.schema}/table/${table.name}/diff`">{{ table.snapshots.length  }}</router-link>
              <router-link v-if="!table.schema" v-bind:to="`/table/${table.name}/diff`">{{ table.snapshots.length }}</router-link>
            </span>
            <span v-if="!table.snapshots.length">
              {{ table.snapshots.length }}
            </span>
          </td>
          <td>
          </td>
        </tr>
      </table>
    </div>
    <dialog id="SnapshottingDialog">
      <p>Creating snapshots {{ processing.tableIndex }} of {{ processing.tableCount }}</p>
      <div class="progress-bar">
        <div class="progress-bar-progress" :style="{ width: processing.progressPercent + '%'}">
        </div>
      </div>
    </dialog>
  </div>
</template>

<script>
  import PageHeader from './PageHeader';

  export default {
    name: 'database-page',
    components: {
      PageHeader,
    },
    data() {
      return {
        tables: this.$store.state.tables,
        connection: this.$store.state.connection,
        databaseTitle: this.$store.getters.databaseTitle,
        processing: {
          tableCount: 0,
          tableIndex: 0,
          progressPercent: 50,
        },
      };
    },
    computed: {
      client() {
        return this.$store.getters.connectionClient;
      },
    },
    methods: {
      async createSnapshots() {
        this.processing.tableIndex = 1;
        this.processing.tableCount = this.$store.state.tables.length;
        this.processing.progressPercent = 0;
        const dialog = document.getElementById('SnapshottingDialog');
        dialog.showModal();

        await Promise.all(this.$store.state.tables.map(async (table, index) => {
          const promise = this.$store.dispatch('snapshotTable', {
            schemaName: table.schema,
            tableName: table.name,
            primaryKeyFields: table.primaryKeyFields,
          })
          .then(async () => {
            // Force refresh of showing which table we are up to
            console.log(index); // eslint-disable-line
            this.processing.tableIndex++;
            this.processing.progressPercent = this.processing.tableIndex /
              this.processing.tableCount * 100;
            await this.$forceUpdate();
          });
          return promise;
        }))
        .catch((err) => {
          dialog.close();
          alert(err.message); // eslint-disable-line
          this.message = err.message;
        });

        dialog.close();
      },
      diffLatestSnapshots() {
      },
    },
  };

</script>

<style>


</style>
