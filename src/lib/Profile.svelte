<script lang="ts">
    import {pb} from "$lib/pocketbase"
    import { onMount } from "svelte";

    let user = {}

    onMount(async () => {
        user = await pb.collection("users").getOne(pb.authStore.model.id)

        await pb.collection("users").subscribeOne(pb.authStore.model.id, (u) => {
            user = u.record
        })
    })
</script>

<div class="card main">
    <div class="card-header">
        Your Profile
    </div>
    <div class="card-body">
        {#if user.name == undefined}
            <h2>Loading...</h2>
        {:else}
            <h2>{user.name}</h2>
            <p class="h5">{user.username}</p>

            <p class="h6">Points: {user.points}</p>
        {/if}
    </div>
</div>

<style lang="scss">
    .main {
        width: 80%;
    }

    .card-body {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
    }

    .card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;

        i {
            &:hover {
                scale: 1.2;
                cursor: pointer;
                transition: all 200ms ease-in;
            }
        }
    }


    @media only screen and (max-width: 750px) {
        .main {
            width: 90%;
        }
    }

    @media only screen and (max-width: 600px) {
        .main {
            width: 100%;
        }
    }
</style>