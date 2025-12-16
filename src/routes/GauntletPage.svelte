<script lang="ts">
    
    const imageWidth = 86;

    const GauntletRows: {
        row: number,
        chars: string[] }[] = [
        { row: 1,  chars: ["rob", "ivy"] },
        { row: 2,  chars: ["mk", "pit"] },
        { row: 3,  chars: ["zss", "wario", "marth"] },
        { row: 4,  chars: ["gnw", "tink", "olimar", "puff"] },
        { row: 5,  chars: ["charizard", "falco", "fox", "dk", "sonic", "ike"] },
        { row: 6,  chars: ["falcon", "ness", "mewtwo", "knuckles", "sheik", "ganon"] },
        { row: 7,  chars: ["roy", "mario", "link", "wolf", "squirtle"] },
        { row: 8,  chars: ["snake", "lucario", "zelda", "pikachu"] },
        { row: 9,  chars: ["luigi", "lucas", "bowser", "kirby", "peach"] },
        { row: 10, chars: ["samus", "yoshi", "ics", "dedede"] }
    ];

</script>

<div class="main-container">

    <div class="header">THE JOSH KENDRICK GAUNTLET</div>
    <div class="row-container">
    {#each GauntletRows as rowData}
        <div class="row"
        style="border-bottom: {rowData.row == GauntletRows.length ? "0" : "1"}px solid #13c3ff;">
            <div class="row-number"
            style="width: {imageWidth}px; height: {imageWidth}px;">{rowData.row}</div>
            {#each rowData.chars as char}
                <img 
                src="/src/lib/assets/icons/{char}.png" 
                alt={char}
                width={imageWidth}
                height={imageWidth}
                />
            {/each}
        </div>
    {/each}
    </div>

</div>

<style lang="postcss">

.main-container {
    border: 1px solid #13c3ff;
    border-radius: 8px;
    padding: 6px;
    margin: 0 auto;
    width: fit-content;
}

.header {
    font-size: 32px;
    font-weight: bold;
}

.row-container {
    border: 1px solid #13c3ff;
    border-radius: 10px;
}

.row {
    display: flex;
    flex-wrap: wrap;
}

.row-number {
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 24px;
}

</style>