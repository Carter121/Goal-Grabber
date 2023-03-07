<script lang="ts">
    import { onMount } from "svelte";
    import { pb } from "$lib/pocketbase"
    import { browser } from "$app/environment";
    import { goto } from "$app/navigation";
    import { page } from "$app/stores";
    import Winners from "$lib/Winners.svelte";

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
    <h1 class="mt-4 text-center">Winners</h1>
    <div class="d-flex justify-content-center">
        <a href="/school/{schoolId}" class="btn btn-primary">Back to School</a>
    </div>
    <Winners schoolId={schoolId} users={schoolData.users}/>
</main>