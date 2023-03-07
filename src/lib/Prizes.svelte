<script lang="ts">
    import {onMount} from "svelte";
    import {pb} from "./pocketbase";

    export let schoolData: object;
    export let prizeList: Array < string > ;
    export let isAdmin: boolean = false;
    export let studentId: string = ""

    let showEdit = false

    let prizes: Array < object > = []

    let tempPrizes: Array < object > = []

    onMount(async () => {
        loadPrizes()
    })

    async function loadPrizes() {
        await fetch("/api/get-prizes", {
                method: "POST",
                body: JSON.stringify(prizeList)
            })
            .then(res => res.json())
            .then(res => prizes = res)

        tempPrizes = [...prizes]
    }

    function openEdit() {
        tempPrizes = [...prizes]
        showEdit = true
    }

    function closeEdit() {
        showEdit = false
        tempPrizes = [...prizes]
    }

    async function saveEdit() {
        showEdit = false;

        prizes = [...tempPrizes]

        let prizeId = prizesToId(prizes)

        //@ts-ignore
        schoolData.prize = prizeId

        pb.collection("school").update(schoolData.id, schoolData)
    }

    function prizesToId(arr: Array < object > ) {
        return arr.map((e) => e.id)
    }

    function deletePrize(index: number) {
        tempPrizes.splice(index, 1)
        tempPrizes = tempPrizes;
    }

    let fileInput: HTMLInputElement;

    let newPrize = {
        name: "",
        points: 0,
    }

    let formData = new FormData();

    async function addPrize() {
        formData.append("name", newPrize.name)
        formData.append("points", newPrize.points.toString())
        formData.append("image", fileInput.files[0])
        const prize = await pb.collection("prize").create(formData).catch((e) => console.log(e))
        schoolData.prize.push(prize.id)
        await pb.collection("school").update(schoolData.id, schoolData)
        location.reload()
    }

    let redeemError = ""
    async function redeemPrize(prizeNum: number) {
        let response = ""
        const prize = tempPrizes[prizeNum]
        await fetch("/api/redeem-prize", {
            method: "POST",
            body: JSON.stringify({student: studentId, prize: prize.id})
        })
            .then(res => res.json())
            .then(res => response = res)

        if(response != "Update") {
            redeemError = response
            return
        } else {
            location.reload()
        }
    }
</script>

{#if showEdit}
<div class="modal" tabindex="-1">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Edit Prizes</h5>
                <button type="button" class="btn-close" aria-label="Close" on:click={closeEdit}></button>
            </div>
            <div class="modal-body">
                <div class="prize-modal-container">
                    {#each tempPrizes as p, i}
                    <div class="card mb-3 prize">
                        <div class="row g-0">
                            <div class="col-md-4">
                                <img src="{p.image}" alt="{p.name}" class="img-fluid rounded-start">
                            </div>
                            <div class="col-md-7">
                                <div class="card-body">
                                    <h5 class="card-title">{p.name}</h5>
                                    <p class="card-text">Points: {p.points}</p>
                                </div>
                            </div>
                            <div class="col-md-1 delete-container">
                                <span on:click={() => deletePrize(i)}><i class="fa-solid fa-trash"></i></span>
                            </div>
                        </div>
                    </div>
                    {/each}
                </div>
                <form on:submit|preventDefault={addPrize}>
                    <label for="new-name" class="form-label">Name</label>
                    <input required type="text" id="new-name" class="form-control" bind:value={newPrize.name}>

                    <label for="new-points" class="form-label">Points</label>
                    <input required pattern="/^\d+$/" type="number" id="new-points" class="form-control" bind:value={newPrize.points} min="0">

                    <label for="" class="form-label">Picture</label>
                    <input required type="file" class="form-control" accept=".jpg,.png,.svg,.webp" bind:this={fileInput}>

                    <button class="btn btn-primary mt-3" type="submit">Add Prize</button>
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
        <span>Prizes {#if redeemError != ""}<span class="error">Error: {redeemError}</span>{/if}</span> {#if isAdmin}<span on:click={openEdit}><i class="fa-solid fa-pen-to-square"></i></span>{/if}
    </div>

    <div class="mini-container">
        {#each prizes as p, i}
        <div class="card">
            <div class="card-header">{p.name}</div>
            <div class="card-img-top">
                <img src="{p.image}" alt="{p.name}">
            </div>

            <div class="card-body">
                <h5 class="card-title">{p.points} Points</h5>
            </div>

            {#if studentId != ""}
            <div class="card-footer">
                <button class="btn btn-primary" on:click={() => redeemPrize(i)}>Redeem</button>
            </div>
            {/if}
        </div>
        {/each}
    </div>
</div>

<style lang="scss">
.error {
    color: red;
}
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
            height: 25rem;
            background-color: #efefef;

            .card-img-top {
                height: 20rem;
                overflow: hidden;
                display: flex;
                align-items: center;
                justify-content: center;
                width: 100%;

                img {
                    height: 100%;
                }
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
}

.delete-container {
    margin-top: 1rem;
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
