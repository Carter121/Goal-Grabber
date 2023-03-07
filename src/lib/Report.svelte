<script lang="ts">
    import { onMount, onDestroy } from "svelte";

    export let users: Array<string> = []
    export let schoolId: string = ""

    let students = []

    let byGrade: Array<object> = []

    let showGrade = -1

    onMount(async () => {
        await getStudents()
    })

    async function getStudents() {
        await fetch("/api/get-report", {
            method: "POST",
            body: JSON.stringify({schoolId, users})
        })
            .then(res => res.json())
            .then(res => students = res)

        byGrade = students.byGrade
    }
</script>

{#if students != []}
    <div class="container mt-5">
        <p class="text-center mt-4 h5">View Grades</p>
        <div class="d-flex gap-5 align-items-center justify-content-center">
            <div class="d-flex gap-2">
                <input type="radio" name="view" id="all" class="form-check-input" checked value={-1} bind:group={showGrade}>
                <label for="all" class="form-check-label">All Grades</label>
            </div>
            {#each byGrade as g}
                <div>
                    <input type="radio" name="view" id="grade-{g.grade}" class="form-check-input" value={g.grade} bind:group={showGrade}>
                    <label for="grade-{g.grade}" class="form-check-label">Only Grade {g.grade}</label>
                </div>
            {/each}
        </div>
    </div>
    <div class="container mt-5">
        {#each byGrade as g }
            {#if showGrade == -1 || showGrade == g.grade}
                <div class="card mb-4">
                    <div class="card-header">Grade: {g.grade}</div>
                    <div class="card-body">
                        <table class="table table-secondary">
                            <thead>
                                <th scope="col">#</th>
                                <th scope="col">Name</th>
                                <th scope="col">Points</th>
                            </thead>
                            <tbody>
                                {#each g.students as s, i}
                                    <tr>
                                        <th scope="row">{i + 1}</th>
                                        <td>{s.name}</td>
                                        <td>{s.points}</td>
                                    </tr>
                                {/each}
                            </tbody>
                        </table>
                    </div>
                </div>
            {/if}
        {/each}
    </div>
{/if}