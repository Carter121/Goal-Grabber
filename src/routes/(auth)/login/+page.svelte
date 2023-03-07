<script lang="ts">
    import { goto } from '$app/navigation';
    import {pb} from '$lib/pocketbase'

    let email = ""
    let password = ""

    let loginError = false

    async function login() {
        resetErrors()

        try {
            await pb.collection("users").authWithPassword(email, password)
        } catch(e) {
            loginError = true
            return
        }

        if (pb.authStore.isValid) {
            goto(`/school/${pb.authStore.model.school_id}`)
        }

    }

    function resetErrors() {
        loginError = false;
    }
</script>

<main>
    <h1>Login</h1>
    <a href="/register">Or register</a>
    {#if loginError}
        <p class="error">Error: Username or password not correct</p>
    {/if}
    <form on:submit|preventDefault={login}>

        <label class="form-label" for="email">Email</label>
        <input type="email" id="email" class="form-control" placeholder="Email" required bind:value={email} on:input={resetErrors}>

        <label for="password">Password</label>
        <input type="password" class="form-control" id="password" required bind:value={password} on:input={resetErrors}>

        <button class="btn btn-primary">Login</button>
    </form>
</main>

<style lang="scss">
    main {
        min-height: 100svh;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
    }

    form {
        display: flex;
        align-items: flex-start;
        justify-content: center;
        flex-direction: column;
        
        input {
            margin-bottom: 1rem;
        }
    }

    label {

        display: flex;
        align-items: center;
        justify-content: center;

        &::after {
            content: "(Required)";
            font-size: 50%;
            margin-left: 0.5rem;
            color: red;
        }
    }

    a {
        margin-bottom: 2rem;
    }

    .error {
        color: red; 
    }
</style>