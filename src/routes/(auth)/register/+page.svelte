<script lang="ts">
    import { goto } from '$app/navigation';
    import {pb} from '$lib/pocketbase'
    import Spinner from '$lib/Spinner.svelte';

    let name = ""
    let username = ""
    let email = ""
    let password = ""
    let passwordConfirm = ""
    let grade = ""
    let joinCode = ""

    let joinCodeError = false

    let passwordErrText = ""
    let passwordError = false;

    let usernameErrText = ""
    let usernameError = false

    let emailErrText = ""
    let emailError = false

    let showSpinner = false

    async function register() {
        showSpinner = true
        resetErrors()
        let response = {}

        await fetch("/api/register", {
            method: "POST",
            body: JSON.stringify({
                name,
                username,
                email,
                password,
                passwordConfirm,
                grade,
                joinCode
            })
        })
        .then(res => response = res)

        let data = await response.json()

        if(data.body == "Join Code Not Found") {
            joinCodeError = true
            showSpinner = false
            return
        }

        if(data.body == "Password") {
            passwordErrText = data.data;
            passwordError = true;
            showSpinner = false
            return;
        }

        if(data.body == "Username") {
            usernameErrText = data.data;
            usernameError = true;
            showSpinner = false
            return;
        }

        if(data.body == "Email") {
            emailErrText = data.data;
            emailError = true;
            showSpinner = false
            return;
        }

        if(data.body == "Confirm") {
            await pb.collection("users").authWithPassword(email, password)
            await goto(`/school/${joinCode}`)
        }
    }

    function resetErrors() {
        joinCodeError = false;
        passwordError = false;
        usernameError = false;
    }
</script>

<main>
    <Spinner showSpinner={showSpinner}/>

    <h1>Register</h1>
    <a href="/login">Or login</a>
    {#if joinCodeError}
        <p class="error">Join Code Not Found</p>
    {/if}

    {#if passwordError}
        <p class="error">Password Error: {passwordErrText}</p>
    {/if}

    {#if usernameError}
        <p class="error">Username Error: {usernameErrText}</p>
    {/if}

    {#if emailError}
        <p class="error">Email Error: {emailErrText}</p>
    {/if}
    <form on:submit|preventDefault={register}>
        <label for="name" class="form-label">Full Name</label>
        <input type="text" class="form-control" id="name" placeholder="Full Name" autocomplete="name" required bind:value={name} on:input={resetErrors}>

        <label for="username" class="form-label">Username</label>
        <input type="text" class="form-control" id="username" placeholder="Username" autocomplete="nickname" required bind:value={username} on:input={resetErrors}>

        <label class="form-label" for="email">Email</label>
        <input type="email" id="email" class="form-control" placeholder="Email"  autocomplete="email" required bind:value={email} on:input={resetErrors}>

        <label for="password">Password</label>
        <input type="password" class="form-control" id="password" autocomplete="new-password" required bind:value={password} on:input={resetErrors}>

        <label for="password-conf">Confirm Password</label>
        <input type="password" class="form-control" id="password-conf" autocomplete="new-password" required bind:value={passwordConfirm} on:input={resetErrors}>

        <label for="grade">Grade</label>
        <select id="grade" class="form-select" bind:value={grade} required>
            {#each Array(12) as _, i}
                <option value="{i+1}">{i+1}</option>
            {/each}
        </select>

        <label for="join-code">Join Code</label>
        <input type="text" class="form-control" id="join-code" required bind:value={joinCode} on:input={resetErrors}>

        <button class="btn btn-primary">Register</button>
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
        
        input, select {
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