<script lang="ts">
    import { onDestroy, onMount } from "svelte";

    export let users: any;
    export let schoolId: string = ""
    export let isAdmin:boolean = false

    let allStudents = []
    let students = []

    let loop: NodeJS.Timer;

    onMount(async () => {
        await getStudents()

        loop = setInterval(async () => {
            await getStudents()
        }, 10000)
    })

    let fullScreen = false
    function toggleFullScreen() {
        fullScreen = !fullScreen
        getStudents()
    }

    onDestroy(() => {
        clearInterval(loop)
    })

    async function getStudents() {
        await fetch("/api/get-leaderboard", {
            method: "POST",
            body: JSON.stringify({users})
        })
            .then(res => res.json())
            .then(res => allStudents = res)
        
        let tempStudents = [...allStudents]
        if(!fullScreen) {
            students = tempStudents.slice(0, 10)
        } else {
            students = allStudents
        }
    }

</script>

<div class="card {fullScreen == true ? "full-screen" : ""}">
    <div class="card-header">
        <span>Leader Board</span> <span on:click={toggleFullScreen}><i class="fa-solid fa-expand"></i></span>
    </div>
    <ul class="list-group list-group-flush">

        {#each students as s, i}
            <li class="list-group-item {i%2 != 0 ? "dark" : ""}">
                
                {#if isAdmin}
                    <a href="/student/{s.id}">{s.name} {s.grade}</a>
                {:else}
                    <span href="/student/{s.id}">{s.name} {s.grade}</span>
                {/if}
                
                <span>{s.points} Points</span></li>
        {/each}

    </ul>
    {#if isAdmin}
        <div class="card-footer">
            <a href="/school/{schoolId}/report" class="btn btn-primary">Generate Report</a>

            <a href="/school/{schoolId}/winners" class="btn btn-primary">Get Random Winners</a>
        </div>
    {/if}
</div>

<style lang="scss">
    .card {
        width: 80%;
        transition: all 400ms ease-in-out;
    }

    .full-screen {
        position: absolute;
        height: 100svh;
        height: 100vh;
        width: 100%;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 100;
    }

    .card-footer {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .card-header {
        display: flex;
        align-items: center;
        justify-content: space-between;

        i {
            &:hover {
                scale: 1.2;
                cursor: pointer;
                transition: all 200ms ease-in;
            }
        }
    }
    .list-group-item {
        display: flex;
        align-items: center;
        justify-content: space-between;

        font-size: 2rem;

        a {
            color: black;
        }
    }
    .dark {
        background-color: #efefef;
    }

    @media only screen and (max-width: 750px) {
        .card {
            width: 90%;
        }
    }

    @media only screen and (max-width: 600px) {
        .card {
            width: 100%;
        }

        .list-group-item {
            font-size: 1rem;
        }
    }
</style>