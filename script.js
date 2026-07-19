(function() {
    const tabellone = document.getElementById('tabellone');
    const tooltip = document.getElementById('tooltip');
    const modal = document.getElementById('modal-acquisto');
    const counter = document.getElementById('counter');
    const GOOGLE_API_URL = "https://script.google.com/macros/s/AKfycbzDegTFimnMMFQsdTukR360jPfk3byurBwo_GPfiPKGVQ3UAwiZ8CqmiF9PoINOhxpf/exec";

    let dataCorrenteVisualizzata = new Date();

    function formattaDataItaliana(data) {
        let d = new Date(data);
        return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
    }

    async function caricaPixel() {
        let datiVenduti = new Map();
        try {
            const response = await fetch(GOOGLE_API_URL);
            const datiRaw = await response.json();
            datiRaw.forEach(riga => {
                if (riga[0]) {
                    let data = formattaDataItaliana(riga[0]);
                    datiVenduti.set(data, riga[1] || "Purchased!");
                }
            });
            counter.innerText = `Pixels claimed: ${datiVenduti.size}/400`;
        } catch (e) { console.error("Error:", e); }

        tabellone.innerHTML = "";
        const dataInizio = new Date(dataCorrenteVisualizzata); 
        
        for (let i = 0; i < 400; i++) {
            let dataPixelObj = new Date(dataInizio);
            dataPixelObj.setDate(dataInizio.getDate() + i);
            let dataStringa = formattaDataItaliana(dataPixelObj);
            
            const pixel = document.createElement('div');
            pixel.classList.add('pixel');
            
            if (datiVenduti.has(dataStringa)) {
                pixel.classList.add('venduto');
                pixel.addEventListener('mouseenter', () => {
                    tooltip.style.display = 'block';
                    tooltip.innerHTML = `<strong>${dataStringa}</strong><br>${datiVenduti.get(dataStringa)}`;
                });
            } else {
                pixel.addEventListener('click', () => {
                    tooltip.style.display = 'none';
                    document.getElementById('data-scelta').innerText = `Date: ${dataStringa}`;
                    modal.style.display = 'flex';
                    document.getElementById('btn-conferma').onclick = () => {
                        const msg = document.getElementById('input-messaggio').value || "No message";
                        window.open(`https://paypal.me/nickpetru/2?note=${encodeURIComponent(dataStringa + " - " + msg)}`, "_blank");
                        modal.style.display = 'none';
                    };
                });
                pixel.addEventListener('mouseenter', () => {
                    tooltip.style.display = 'block';
                    tooltip.innerText = dataStringa;
                });
            }
            pixel.addEventListener('mousemove', (e) => { tooltip.style.left = (e.clientX + 10) + 'px'; tooltip.style.top = (e.clientY + 10) + 'px'; });
            pixel.addEventListener('mouseleave', () => tooltip.style.display = 'none');
            tabellone.appendChild(pixel);
        }
        document.getElementById('btn-chiudi').onclick = () => modal.style.display = 'none';
    }

    window.cambiaData = (giorni) => {
        const classeAnim = giorni > 0 ? 'slide-left' : 'slide-right';
        tabellone.classList.add(classeAnim);
        
        setTimeout(() => {
            dataCorrenteVisualizzata.setDate(dataCorrenteVisualizzata.getDate() + giorni);
            tabellone.style.transition = 'none';
            tabellone.classList.remove(classeAnim);
            tabellone.style.opacity = '0';
            
            caricaPixel();
            
            setTimeout(() => {
                tabellone.style.transition = 'transform 0.6s ease-in-out, opacity 0.6s ease-in-out';
                tabellone.style.opacity = '1';
            }, 50);
        }, 600);
    };

    caricaPixel();
})();
