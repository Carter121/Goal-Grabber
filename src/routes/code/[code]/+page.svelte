<script lang="ts">
    import {pb} from "$lib/pocketbase"
    import { page } from "$app/stores";
    import { onMount } from "svelte";
    
    const code = $page.params.code

    const user = pb.authStore.model

    let confirm = false;

    let error = ""

    onMount(() => {
        loadCode()
    })

    async function loadCode() {
        let response = {}
        await fetch("/api/check-code", {
            method: "POST",
            body: JSON.stringify({code: code, user: user.id})
        })
            .then(res => response = res)

        let body = await response.json()

        if(response.status == 400) {
            error = body.body
            return
        }

        if(response.status == 200) {
            confirm = true
            return
        }
    }
</script>

<main>
    {#if confirm}
        <h1>Success!</h1>
    {:else if error != ""}
        <h1 class="text-center error">{error}</h1>
    {:else}
        <h1 class="text-center">Loading...</h1>
    {/if}
    <a href="{`/school/${user.school_id}`}" class="btn btn-primary">Return</a>
</main>

<style lang="scss">
    .error {
        color: red;
    }
    main {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;

        .btn {
            margin-top: 5rem;
        }
    }
</style>