<script lang="ts">
    import { browser } from "$app/environment";
    import { goto } from "$app/navigation";
    import { page } from "$app/stores";
    import { pb } from "$lib/pocketbase";import Prizes from "$lib/Prizes.svelte";
;
    import { onMount } from "svelte";


    if(!pb.authStore.isValid) {
        if(browser) goto("/login")
    }

    const userId = pb.authStore.model.id

    const studentId = $page.params.id

    let error = ""

    let data = {
        student: {
            name: "Loading...",
            grade: "Loading...",
            points: "Loading..."
        },
        school: {}
    }

    onMount(async () => {
        let response = {}
        await fetch(`/api/get-student`, {
            method: "POST",
            body: JSON.stringify({student: studentId, user: userId})
        })
            .then(res => response = res)

        if(response.status == 500) {
            error = "User Not Found"
            return
        }

        if(response.status == 401) {
            error = "Unauthroized"
            return
        }

        data = await response.json()
    })
</script>

{#if error != ""}
<main>
    <h1 class="error">{error}</h1>
</main>
{/if}

{#if data.student.name == "Loading..." && error == ""}
<main>
    <h1>Loading...</h1>
</main>
{/if}

{#if data.student.name != "Loading..."}
<main>
    <h1>{data.student.name}</h1>
    <p class="h2">Grade: {data.student.grade}</p>
    <p class="h3">Points: {data.student.points}</p>

    <div class="spacer"></div>
    <Prizes prizeList={data.school.prize} schoolData={data.school} isAdmin={false} studentId={studentId}/>
</main>
    
{/if}

<style lang="scss">
    .spacer {
        margin: 1rem;
    }
    h1 {
        margin-top: 2rem;
    }

    main {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        flex-direction: column;
    }
    .error {
        color: red;
    }
</style>