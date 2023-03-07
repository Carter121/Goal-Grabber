<header>
    <div>
        <h1>Goal Grabber</h1>
        <p>The all in one solution to keeping students engaged in after school activities</p>
    </div>
    <div>
        <img src="/header-img.svg" alt="Finding a Solution">
    </div>
</header>

<main>
    
</main>


<style lang="scss">
    header {
        height: 100vh;
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        place-items: center;

        h1 {
            font-size: 5rem;
        }

        p {
            font-size: 1.5rem;
        }

        div {
            display: flex;
            align-items: center;
            justify-content: center;
            flex-direction: column;
            height: 100%;
            width: 100%;

            img {
                width: 80%;
            }
        }
    }
</style>