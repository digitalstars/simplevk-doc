<template>
  <div></div>
</template>

<script>
  export default {
    name: "redir",
    props: ['redir'],
    created() {
      this.$router.push(this.redir);
    }
  }
</script>

<style scoped>

</style>