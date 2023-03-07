<script lang="ts">
    import { onMount } from "svelte";
    import {pb} from "$lib/pocketbase"
    import Spinner from "./Spinner.svelte";


    export let schoolData: object;
    export let eventList: Array<string>;

    let events: Array<object> = []

    let tempEvents: Array<object> = []
    
    onMount(async () => {
        loadEvents()
    })

    async function loadEvents() {
        await fetch("/api/get-events", {
            method: "POST",
            body: JSON.stringify(eventList)
        })
            .then(res => res.json())
            .then(res => events = res)

        tempEvents = [...events]
    }

    let showCodes = false;
    function toggleCodes() {
        showCodes = !showCodes
    }

    let showEdit = false;

    function openEdit() {
        tempEvents = [...events]
        showEdit = true
    }

    function closeEdit() {
        showEdit = false
        tempEvents = [...events]
    }

    async function saveEdit() {
        showEdit = false;

        events = [...tempEvents]

        let eventId = eventsToId(events)

        //@ts-ignore
        schoolData.event = eventId

        pb.collection("school").update(schoolData.id, schoolData)
    }

    function eventsToId(arr: Array<object>) {
        return arr.map((e) => e.id)
    }

    function deleteEvent(index: number) {
        tempEvents.splice(index, 1)
        tempEvents = tempEvents;
    }

    let newEvent = {
        name: "",
        points: 0,
    }

    let showSpinner = false
    async function addEvent() {
        showSpinner = true
        let code = randomNameGenerator(10)

        const data = {
            title: newEvent.name,
            points: newEvent.points,
            code
        }

        const event = await pb.collection("event").create(data).catch(e => console.log(e))
        schoolData.event.push(event.id)
        await pb.collection("school").update(schoolData.id, schoolData)

        await fetch("/api/add-event", {
            method: "POST",
            body: JSON.stringify({id: event.id})
        })
        showSpinner = false
        location.reload()
    }

    function randomNameGenerator(num:number) {
        let res = '';
        for(let i = 0; i < num; i++){
            const random = Math.floor(Math.random() * 27);
            let newChar = String.fromCharCode(97 + random);

            const exclude = `{}[]()*^<>,./:;"'|\\+= `
            while(exclude.includes(newChar)) {
                console.log(newChar)
                const random = Math.floor(Math.random() * 27);
                newChar = String.fromCharCode(97 + random)
            }
            res += newChar
        };
        return res;
    };

</script>

<Spinner showSpinner={showSpinner}/>

{#if showEdit}
    <div class="modal" tabindex="-1">
        <div class="modal-dialog">
            <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Edit Events</h5>
                <button type="button" class="btn-close" aria-label="Close" on:click={closeEdit}></button>
            </div>
            <div class="modal-body">
                <div class="prize-modal-container">
                    {#each tempEvents as e, i}
                        <div class="card mb-3 prize">
                            <div class="card-body">
                                <div>
                                    <h5 class="card-title">{e.name}</h5>
                                    <p class="card-text">Points: {e.points}</p>
                                </div>
                                <div>
                                    <span on:click={() => deleteEvent(i)}><i class="fa-solid fa-trash"></i></span>
                                </div>
                            </div>
                        </div>
                    {/each}
                </div>
                <form on:submit|preventDefault={addEvent}>
                    <label for="new-name" class="form-label">Name</label>
                    <input required type="text" id="new-name" class="form-control" bind:value={newEvent.name} autocomplete="off">

                    <label for="new-points" class="form-label">Points</label>
                    <input required pattern="/^\d+$/" type="number" id="new-points" class="form-control" bind:value={newEvent.points} min="0">

                    <button class="btn btn-primary mt-3" type="submit">Add Event</button>
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" on:click={closeEdit}>Close</button>
                <button type="button" class="btn btn-primary" on:click={saveEdit}>Save changes</button>
            </div>
            </div>
        </div>
    </div>
{/if}

<div class="card main">
    <div class="card-header">
        <span>Events</span> <div><button on:click={toggleCodes} class="btn btn-primary">{showCodes == true ? "Hide" : "Show"} Codes</button>  <span on:click={openEdit}><i class="fa-solid fa-pen-to-square"></i></span></div>
    </div>

    <div class="mini-container">
        {#each events as p}
            <div class="card">
                <div class="card-header">{p.name}</div>
                <div class="card-body">
                    <h5 class="card-title">{p.points} Points</h5>
                    {#if showCodes}<p class="card-text">Code: {p.code}</p>{/if}
                    <a href="{p.qr_code}" target="_blank" class="btn btn-primary">Print Qr Code</a>
                </div>
            </div>
        {/each}
    </div>
</div>

<style lang="scss">
    .main {
        width: 80%;

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

        .mini-container {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 100%;
            padding: 0.5rem;
            flex-wrap: wrap;
            gap: 2rem;

            .card {
                width: 20rem;
                height: 12rem;
                background-color: #efefef;

                .card-body {
                    display: flex;
                    align-items: flex-start;
                    justify-content: space-between;
                    flex-direction: column;
                }
            }
        }
    }

    .modal {
        display: block;

        color: black;

        .modal-dialog {
            display: block;
        }

        .modal-content {
            display: block;
        }

        .prize {
            i {
                &:hover {
                    scale: 1.2;
                    cursor: pointer;
                    transition: all 200ms ease-in;
                }
            }
        }

        .card-body {
            display: flex;
            align-items: center;
            justify-content: space-between;
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