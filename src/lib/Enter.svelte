<script lang="ts">
    import { pb } from "./pocketbase";
    import QrScanner from 'qr-scanner';
    import { onMount } from "svelte";
    import { goto } from "$app/navigation";

    let video: HTMLVideoElement = null
    let scanner: QrScanner = null
    let showScanner = false;

    onMount(() => {
        scanner = new QrScanner(video, (e) => {
            inputCode = e.data.slice(29, 39)
            checkCode()
        }, {highlightScanRegion: true, highlightCodeOutline: true})
    })

    let inputCode = ""

    let codeError = false;
    let codeErrorTxt = ""
    
    async function checkCode() {
        goto(`/code/${inputCode}`)
    }

    function resetErrors() {
        codeError = false
    }

    function toggleScanner() {
        showScanner = !showScanner
        if(showScanner) {
            scanner.start()
        } else {
            scanner.stop()
        }
    }

</script>

<div class="card main">
    <div class="card-header">Enter or Scan Code</div>
    <div class="card-body">
        <div class="scan-container">
            <video bind:this={video}></video>

            <button class="btn btn-primary" on:click={toggleScanner}>{showScanner == true ? "Hide Qr Code Scanner" : "Show Qr Code Scanner"}</button>
        </div>
        <div class="manual">
            {#if codeError}
                <p class="fw-bold error">Code Error: {codeErrorTxt}</p>
            {/if}
            <p class="fw-bold">Or Enter Code</p>
            <form on:submit|preventDefault={checkCode}>
                {#if codeError}
                    <p class="fw-bold error">Code Error: {codeErrorTxt}</p>
                {/if}
                <label for="code" class="form-label">Code</label>
                <input type="text" id="code" class="form-control" bind:value={inputCode} autocomplete="off" on:input={resetErrors}>
                
                {#if inputCode.length > 0}
                    <button class="btn btn-primary">Submit</button>
                {:else}
                    <button disabled class="btn btn-primary">Submit</button>
                {/if}
            </form>
        </div>
        
    </div>
</div>

<style lang="scss">
    .main {
        width: 80%;
    }

    .manual {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        flex-direction: column;
        width: 100%;
    }

    .scan-container {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        flex-direction: column;
        margin-bottom: 2rem;
    }

    .card-body {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;

        video {
            width: 80%;
        }
    }

    form {
        width: 50%;
        
        .btn {
            margin-top: 1rem;
        }
    }

    .error {
        text-align: center;
        color: red;
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