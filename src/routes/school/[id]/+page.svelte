<script lang="ts">
    import { goto } from "$app/navigation";
    import {pb} from "$lib/pocketbase"
    import {page} from "$app/stores"
    import { onMount } from "svelte";
    import Leaderboard from "$lib/Leaderboard.svelte";
    import Prizes from "$lib/Prizes.svelte";
    import { browser } from "$app/environment";
    import Enter from "$lib/Enter.svelte";
    import Profile from "$lib/Profile.svelte";
    import Events from "$lib/Events.svelte";

    if(!pb.authStore.isValid) {
        if(browser) goto("/login")
    }

    const schoolId = $page.params.id

    let isAdmin = false;

    let schoolData = {
        admin: "Loading...",
        collectionId: "Loading...",
        collectionName: "Loading...",
        created: "Loading...",
        id: "Loading...",
        join_key: schoolId,
        name: "Loading...",
        prize: ["Loading..."],
        qr_code: ["Loading..."],
        updated: "Loading...",
        users: []
    }

    onMount(async () => {
        await fetch("/api/get-school", {
            method: "POST",
            body: JSON.stringify(pb.authStore.model)
        })
            .then(res => res.json())
            .then(res => schoolData = res)

        if(pb.authStore.model?.id == schoolData.admin) isAdmin = true
    })

</script>

<main>
    <h1>{schoolData.name}</h1>
    <p class="text-center">School Join Key: {schoolData.join_key}</p>

    {#if schoolData.admin != "Loading..."}
        <Leaderboard users={schoolData.users} schoolId={schoolId} isAdmin={isAdmin}/>
        <div class="spacer"></div>
        <Prizes prizeList={schoolData.prize} isAdmin={isAdmin} schoolData={schoolData}/>
        {#if !isAdmin }
            <div class="spacer"></div>
            <Enter/>
            <div class="spacer"></div>
            <Profile/>
            {:else}
            <div class="spacer"></div>
            <Events eventList={schoolData.event} schoolData={schoolData}/>
        {/if}
    {/if}
</main>

<style>
    main {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: flex-start;
        flex-direction: column;
        margin-bottom: 2rem;
    }

    h1 {
        margin-top: 2rem;
    }

    p {
        margin-bottom: 2rem;
    }

    .spacer {
        margin: 2rem;
    }
</style>