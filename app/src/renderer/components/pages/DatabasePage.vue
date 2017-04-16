<template>
  <div class="container">
    <page-header/>
    <div class="column">
      <p v-if="!tables.length">
        No tables found in 'database' {{ databaseTitle }} (system tables are excluded.)
      </p>

      <!--Toolbar-->
      <div class="nav">
        <div class="nav-left">
          <a class="nav-item is-small" @click="createSnapshots" title="Create new snapshot for all tables">
            <span class="icon is-small">
              <i class="fa fa-clone"/>
            </span>
          </a>
          <a class="nav-item is-small" @click="diffLatestSnapshots" title="Diff current data against latest snapshot">
            <span class="icon is-small">
              <i class="fa fa-balance-scale"/>
            </span>
          </a>
        </div>
        <div class="nav-center">
          <span class="nav-item">
            Tables
          </span> 
        </div>
        <div class="nav-right">
        </div>
      </div>

      <!--Table-->
      <b-table :data="tables" v-if="tables.length" :selectable="true" :striped="true" @select="tableSelected">
          <b-table-column field="schema" label="Schema" v-if="client.hasSchemas"/>
          <b-table-column field="name" label="Name"/>
          <b-table-column field="snapshotCreated" label="Snapshot" :format="formatTime"/>
          <b-table-column field="diff" label="Diff"/>
        <!--<tr v-for="table in tables">
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
        </tr>-->
      </b-table>
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
  import { formatTime } from '../../formatters';
  import PageHeader from './PageHeader';

  export default {
    name: 'database-page',
    components: {
      PageHeader,
    },
    data() {
      return {
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
      tables() {
        return this.$store.state.tables;
      },
    },
    methods: {
      formatTime,
      tableSelected(selectedTable) {
        this.$router.push({ name: 'schemaTable', params: {
          schemaName: selectedTable.schema,
          tableName: selectedTable.name,
        } });
      },
      async createSnapshots() {
        this.processing.tableIndex = 1;
        this.processing.tableCount = this.$store.state.tables.length;
        this.processing.progressPercent = 0;
        const dialog = document.getElementById('SnapshottingDialog');
        dialog.showModal();

        await Promise.all(this.$store.state.tables.map(async (table) => {
          const promise = this.$store.dispatch('snapshotTable', {
            schemaName: table.schema,
            tableName: table.name,
          })
          .then(async () => {
            // Force refresh of showing which table we are up to
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
