<script lang="ts">
    import { goto } from "$app/navigation";
    import { browser } from "$app/environment";
    import {pb} from "$lib/pocketbase"

    let isLoggedIn = pb.authStore.isValid

    pb.authStore.onChange(() => {
        isLoggedIn = pb.authStore.isValid
    })

    async function signOut() {
        await pb.authStore.clear()
        if(browser) {
            goto("/login")
        }
    }
</script>


<nav class="navbar navbar-expand-xxl bg-body-tertiary">
    <div class="container-fluid">
        <a href="/" class="navbar-brand">GG</a>

        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mainNav" aria-controls="mainNav" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>


        <div class="collapse navbar-collapse main-nav" id="mainNav">
            <ul class="navbar-nav">
                <li class="nav-item">
                    <a href="/" class="nav-link">Home</a>
                </li>
                <li class="nav-item">
                    <a href="/help" class="nav-link">Help</a>
                </li>
            </ul>

            <div>
                {#if isLoggedIn}
                        <a href="{`/school/${pb.authStore.model.school_id}`}" class="btn btn-secondary" data-sveltekit-preload-data="off">My School</a>
                        <button class="btn btn-danger" on:click={signOut}>Sign Out</button>
                    {:else}
                        <a href="/register" class="btn btn-success">Register</a>
                        <a href="/login" class="btn btn-success">Login</a>
                {/if}
            </div>
        </div>
    </div>
</nav>
<slot></slot>


<style lang="scss">
    #mainNav {
        justify-content: space-between;
    }
</style>