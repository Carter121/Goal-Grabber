<script lang="ts">
    import {pb} from "$lib/pocketbase"
    import {page} from "$app/stores"
    import { onMount } from "svelte";
    import Report from "$lib/Report.svelte";
    import { browser } from "$app/environment";
    import { goto } from "$app/navigation";

    if(!pb.authStore.isValid) {
        if(browser) goto("/login")
    }

    const schoolId = $page.params.id

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
    })

</script>


<main>
    <h1 class="text-center mt-4">{schoolData.admin == "Loading..." ? "Loading..." : "Report"}</h1>
    <div class="d-flex justify-content-center">
        <a href="/school/{schoolId}" class="btn btn-primary">Back to School</a>
    </div>

    {#if schoolData.admin != "Loading..."}
        <Report users={schoolData.users} schoolId={schoolId}/>
    {/if}
</main>