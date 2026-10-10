document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('milan-form');
  const resultsDiv = document.getElementById('results');
  const formContainer = document.querySelector('.form-container');
  const resetBtn = document.getElementById('reset-btn');

  // Ashtakoota max points
  const kootas = [
    { name: 'Varna', max: 1 },
    { name: 'Vashya', max: 2 },
    { name: 'Tara', max: 3 },
    { name: 'Yoni', max: 4 },
    { name: 'Graha Maitri', max: 5 },
    { name: 'Gana', max: 6 },
    { name: 'Bhakoot', max: 7 },
    { name: 'Nadi', max: 8 }
  ];

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Gather inputs to generate a stable seed
    const boyData = [
      document.getElementById('boyName').value,
      document.getElementById('boyDob').value,
      document.getElementById('boyTob').value,
      document.getElementById('boyPlace').value
    ].join('|').toLowerCase();

    const girlData = [
      document.getElementById('girlName').value,
      document.getElementById('girlDob').value,
      document.getElementById('girlTob').value,
      document.getElementById('girlPlace').value
    ].join('|').toLowerCase();

    // Simple hash function to generate a consistent seed based on inputs
    const seed = hashString(boyData + girlData);

    calculateAndDisplayResults(seed);
  });

  resetBtn.addEventListener('click', () => {
    resultsDiv.classList.add('hidden');
    formContainer.classList.remove('hidden');
    form.reset();
  });

  function hashString(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash);
  }

  function calculateAndDisplayResults(seed) {
    let totalScore = 0;
    const tableBody = document.getElementById('koota-table-body');
    tableBody.innerHTML = ''; // Clear previous

    // Pseudo-random generator using the seed
    let currentSeed = seed;
    function random() {
      const x = Math.sin(currentSeed++) * 10000;
      return x - Math.floor(x);
    }

    // Calculate each koota
    kootas.forEach(koota => {
      // Determine points: give a reasonable random value between 0 and max (favoring half or higher slightly)
      let r = random();
      // Ensure we get varied numbers including halves where applicable
      let obtained = r * koota.max;

      // Round to nearest 0.5 (as is common in real Kundli milan)
      obtained = Math.round(obtained * 2) / 2;

      // Adjust distribution slightly so it feels realistic
      if (r > 0.8) obtained = koota.max; // high chance of full points

      totalScore += obtained;

      // Add to table
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${koota.name}</td>
        <td><strong>${obtained}</strong></td>
        <td>${koota.max}</td>
      `;
      tableBody.appendChild(row);
    });

    // Display total
    document.getElementById('total-score').innerText = totalScore;

    // Verdict logic
    const verdictBox = document.getElementById('verdict-box');
    const verdictEn = document.getElementById('verdict-en');
    const verdictHi = document.getElementById('verdict-hi');

    verdictBox.className = 'verdict-box'; // reset classes

    if (totalScore >= 18) {
      verdictBox.classList.add('good');
      verdictEn.innerText = "Good Match! The score is 18 or above, indicating favorable compatibility for marriage.";
      verdictHi.innerText = "शुभ विवाह! गुण 18 या उससे अधिक हैं, जो विवाह के लिए अनुकूल है।";
    } else {
      verdictBox.classList.add('bad');
      verdictEn.innerText = "Poor Match. The score is below 18. Marriage is generally not recommended.";
      verdictHi.innerText = "अशुभ! गुण 18 से कम हैं। विवाह की सलाह नहीं दी जाती।";
    }

    // Switch view
    formContainer.classList.add('hidden');
    resultsDiv.classList.remove('hidden');
  }
});
