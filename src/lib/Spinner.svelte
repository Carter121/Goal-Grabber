<script lang="ts">
    export let showSpinner;
</script>

<div class="loading {showSpinner == false ? "d-none" : ""}">
    <div class="spinner-border text-light" role="status">
        <span class="visually-hidden">Loading...</span>
    </div>
</div>

<style lang="scss">
    .loading {
        position: fixed;
        top: 0;
        left: 0;
        height: 100%;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: rgba($color: #000000, $alpha: 0.7);
        z-index: 999999999;
    }
</style>