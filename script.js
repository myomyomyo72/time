document.addEventListener('DOMContentLoaded', () => {
    const tabs = document.querySelectorAll('.tab');
    const tabContents = document.querySelectorAll('.tab-content');
    const kyotoOsakaTimetableDiv = document.getElementById('kyotoOsakaTimetable');

    const nishiojiOsakaDirectResults = document.getElementById('nishioji_osaka_direct_results').querySelector('.train-list');
    const nishiojiOsakaViaKyotoResults = document.getElementById('nishioji_osaka_via_kyoto_results').querySelector('.train-list');
    const osakaNishiojiDirectResults = document.getElementById('osaka_nishioji_direct_results').querySelector('.train-list');
    const osakaNishiojiViaKyotoResults = document.getElementById('osaka_nishioji_via_kyoto_results').querySelector('.train-list');

    // --- 簡易的な時刻表データ（ローカルデータ） ---
    // （以前と同じデータを使用）
    const timetables = {
        nishioji_to_kyoto: [
            { time: "06:02", type: "普通" }, { time: "06:11", type: "普通" }, { time: "06:20", type: "普通" },
            { time: "06:29", type: "快速" }, { time: "07:00", type: "普通" }, { time: "07:07", type: "普通" },
            { time: "07:15", type: "普通" }, { time: "07:23", type: "快速" }, { time: "07:30", type: "普通" },
            { time: "07:39", type: "普通" }, { time: "07:45", type: "普通" }, { time: "07:54", type: "普通" },
            { time: "08:00", type: "普通" }, { time: "08:08", type: "快速" }, { time: "08:15", type: "普通" },
            { time: "08:24", type: "普通" }, { time: "08:30", type: "普通" }, { time: "08:39", type: "快速" },
            { time: "08:45", type: "普通" }, { time: "08:54", type: "普通" },
        ],
        nishioji_to_osaka_direct: [
            { time: "06:00", type: "普通", destination: "西明石" }, { time: "06:07", type: "快速", destination: "網干" },
            { time: "06:29", type: "快速", destination: "網干" }, { time: "07:00", type: "普通", destination: "西明石" },
            { time: "07:06", type: "普通（高槻から快速）", destination: "姫路" }, { time: "07:15", type: "普通", destination: "西明石" },
            { time: "07:21", type: "普通（高槻から快速）", destination: "網干" }, { time: "07:30", type: "普通", destination: "西明石" },
            { time: "07:36", type: "普通（高槻から快速）", destination: "姫路" }, { time: "07:45", type: "普通", destination: "西明石" },
            { time: "07:52", type: "普通（高槻から快速）", destination: "姫路" },
            { time: "08:00", type: "普通", destination: "西明石" }, { time: "08:07", type: "普通（高槻から快速）", destination: "加古川" },
            { time: "08:15", type: "普通", destination: "西明石" }, { time: "08:22", type: "普通（高槻から快速）", destination: "網干" },
        ],
        kyoto_to_osaka_shinkaisoku: [
            { time: "07:14", type: "新快速", destination: "姫路" }, { time: "07:29", type: "新快速", destination: "播州赤穂" },
            { time: "07:37", type: "新快速", destination: "大阪" }, { time: "07:44", type: "新快速", destination: "姫路" },
            { time: "07:59", type: "新快速", destination: "姫路" }, { time: "08:14", type: "新快速", destination: "姫路" },
            { time: "08:29", type: "新快速", destination: "姫路" }, { time: "08:44", type: "新快速", destination: "網干" },
            { time: "09:00", type: "新快速", destination: "姫路" }, { time: "09:14", type: "新快速", destination: "姫路" },
        ],
        osaka_to_nishioji_direct: [
            { time: "06:05", type: "普通", destination: "京都" }, { time: "06:15", type: "快速", destination: "米原" },
            { time: "06:25", type: "普通", destination: "京都" }, { time: "06:35", type: "新快速", destination: "敦賀" },
            { time: "06:45", type: "普通", destination: "京都" }, { time: "06:55", type: "快速", destination: "草津" },
            { time: "07:05", type: "普通", destination: "京都" }, { time: "07:15", type: "新快速", destination: "長浜" },
            { time: "07:25", type: "普通", destination: "京都" }, { time: "07:35", type: "快速", destination: "野洲" },
            { time: "07:45", type: "普通", destination: "京都" }, { time: "07:55", type: "新快速", destination: "米原" },
        ],
        osaka_to_kyoto_shinkaisoku: [
            { time: "06:00", type: "新快速", destination: "敦賀" }, { time: "06:15", type: "新快速", destination: "長浜" },
            { time: "06:30", type: "新快速", destination: "米原" }, { time: "06:45", type: "新快速", destination: "敦賀" },
            { time: "07:00", type: "新快速", destination: "長浜" }, { time: "07:15", type: "新快速", destination: "米原" },
            { time: "07:30", type: "新快速", destination: "敦賀" }, { time: "07:45", type: "新快速", destination: "長浜" },
            { time: "08:00", type: "新快速", destination: "米原" }, { time: "08:15", type: "新快速", destination: "敦賀" },
        ],
        kyoto_to_nishioji: [
            { time: "06:05", type: "普通" }, { time: "06:15", type: "快速" },
            { time: "06:20", type: "普通" }, { time: "06:30", type: "普通" },
            { time: "06:40", type: "快速" }, { time: "06:50", type: "普通" },
            { time: "07:00", type: "普通" }, { time: "07:10", type: "快速" },
            { time: "07:20", type: "普通" }, { time: "07:30", type: "普通" },
            { time: "07:40", type: "快速" }, { time: "07:50", type: "普通" },
        ]
    };

    const TRAVEL_TIMES = {
        nishioji_to_kyoto_local: 3,
        kyoto_to_osaka_shinkaisoku: 30,
        nishioji_to_osaka_local: 45,
        nishioji_to_osaka_rapid: 35,
        transfer_time: 2,

        osaka_to_kyoto_shinkaisoku: 30,
        kyoto_to_nishioji_local: 3,
        osaka_to_nishioji_local: 45,
        osaka_to_nishioji_rapid: 35,
    };

    function timeToMinutes(timeStr) {
        const [hours, minutes] = timeStr.split(':').map(Number);
        return hours * 60 + minutes;
    }

    function minutesToTime(totalMinutes) {
        const hours = Math.floor(totalMinutes / 60) % 24;
        const minutes = totalMinutes % 60;
        return `<span class="math-inline">\{String\(hours\)\.padStart\(2, '0'\)\}\:</span>{String(minutes).padStart(2, '0')}`;
    }

    function getNextTrains(timetable, currentTimeMinutes, count = 3) {
        return timetable
            .filter(train => timeToMinutes(train.time) >= currentTimeMinutes)
            .slice(0, count);
    }

    function displayNishiojiToOsakaResults() {
        const now = new Date();
        const currentTimeMinutes = now.getHours() * 60 + now.getMinutes();

        nishiojiOsakaDirectResults.innerHTML = '';
        const nextDirectTrains = getNextTrains(timetables.nishioji_to_osaka_direct, currentTimeMinutes);
        if (nextDirectTrains.length > 0) {
            nextDirectTrains.forEach(train => {
                const departureTime = train.time;
                let travelTime = train.type.includes("快速") ? TRAVEL_TIMES.nishioji_to_osaka_rapid : TRAVEL_TIMES.nishioji_to_osaka_local;
                const arrivalMinutes = timeToMinutes(departureTime) + travelTime;
                const listItem = document.createElement('li');
                listItem.innerHTML = `<strong><span class="math-inline">\{departureTime\}</strong\>発 \(</span>{train.type} <span class="math-inline">\{train\.destination\}行\) → 大阪着 <strong\></span>{minutesToTime(arrivalMinutes)}</strong> (所要時間 約 ${travelTime}分)`;
                nishiojiOsakaDirectResults.appendChild(listItem);
            });
        } else {
            nishiojiOsakaDirectResults.innerHTML = '<li>現在時刻以降の直通列車はありません。</li>';
        }

        nishiojiOsakaViaKyotoResults.innerHTML = '';
        const nextNishiojiToKyoto = getNextTrains(timetables.nishioji_to_kyoto, currentTimeMinutes);
        if (nextNishiojiToKyoto.length > 0) {
            nextNishiojiToKyoto.forEach(firstLegTrain => {
                const firstLegDepartureTime = firstLegTrain.time;
                const arrivalKyotoMinutes = timeToMinutes(firstLegDepartureTime) + TRAVEL_TIMES.nishioji_to_kyoto_local;
                const earliestKyotoDepartureMinutes = arrivalKyotoMinutes + TRAVEL_TIMES.transfer_time;
                const connectingShinKaisoku = timetables.kyoto_to_osaka_shinkaisoku.find(
                    skTrain => timeToMinutes(skTrain.time) >= earliestKyotoDepartureMinutes
                );

                if (connectingShinKaisoku) {
                    const secondLegDepartureTime = connectingShinKaisoku.time;
                    const finalArrivalMinutes = timeToMinutes(secondLegDepartureTime) + TRAVEL_TIMES.kyoto_to_osaka_shinkaisoku;
                    const listItem = document.createElement('li');
                    listItem.innerHTML = `<strong>${firstLegDepartureTime}</strong>発 (京都行) → 京都着 ${minutesToTime(arrivalKyotoMinutes)}<br>` +
                        `京都発 <strong>${secondLegDepartureTime}</strong> (新快速 <span class="math-inline">\{connectingShinKaisoku\.destination\}行\) → 大阪着 <strong\></span>{minutesToTime(finalArrivalMinutes)}</strong> (乗り換え時間 約 ${minutesToTime(secondLegDepartureTime) - minutesToTime(arrivalKyotoMinutes)}分)`;
                    nishiojiOsakaViaKyotoResults.appendChild(listItem);
                }
            });
            if (nishiojiOsakaViaKyotoResults.innerHTML === '') {
                nishiojiOsakaViaKyotoResults.innerHTML = '<li>現在時刻以降、乗り換え可能な組み合わせはありません。</li>';
            }
        } else {
            nishiojiOsakaViaKyotoResults.innerHTML = '<li>現在時刻以降の京都方面行きはありません。</li>';
        }
    }

    function displayOsakaToNishiojiResults() {
        const now = new Date();
        const currentTimeMinutes = now.getHours() * 60 + now.getMinutes();

        osakaNishiojiDirectResults.innerHTML = '';
        const nextDirectTrains = getNextTrains(timetables.osaka_to_nishioji_direct, currentTimeMinutes);
        if (nextDirectTrains.length > 0) {
            nextDirectTrains.forEach(train => {
                const departureTime = train.time;
                let travelTime = train.type.includes("快速") ? TRAVEL_TIMES.osaka_to_nishioji_rapid : TRAVEL_TIMES.osaka_to_nishioji_local;
                const arrivalMinutes = timeToMinutes(departureTime) + travelTime;
                const listItem = document.createElement('li');
                listItem.innerHTML = `<strong><span class="math-inline">\{departureTime\}</strong\>発 \(</span>{train.type} <span class="math-inline">\{train\.destination\}行\) → 西大路着 <strong\></span>{minutesToTime(arrivalMinutes)}</strong> (所要時間 約 ${travelTime}分)`;
                osakaNishiojiDirectResults.appendChild(listItem);
            });
        } else {
            osakaNishiojiDirectResults.innerHTML = '<li>現在時刻以降の直通列車はありません。</li>';
        }

        osakaNishiojiViaKyotoResults.innerHTML = '';
        const nextOsakaToKyoto = getNextTrains(timetables.osaka_to_kyoto_shinkaisoku, currentTimeMinutes);
        if (nextOsakaToKyoto.length > 0) {
            nextOsakaToKyoto.forEach(firstLegTrain => {
                const firstLegDepartureTime = firstLegTrain.time;
                const arrivalKyotoMinutes = timeToMinutes(firstLegDepartureTime) + TRAVEL_TIMES.osaka_to_kyoto_shinkaisoku;
                const earliestKyotoDepartureMinutes = arrivalKyotoMinutes + TRAVEL_TIMES.transfer_time;
                const connectingLocal = timetables.kyoto_to_nishioji.find(
                    localTrain => timeToMinutes(localTrain.time) >= earliestKyotoDepartureMinutes
                );

                if (connectingLocal) {
                    const secondLegDepartureTime = connectingLocal.time;
                    const finalArrivalMinutes = timeToMinutes(secondLegDepartureTime) + TRAVEL_TIMES.kyoto_to_nishioji_local;
                    const listItem = document.createElement('li');
                    listItem.innerHTML = `<strong>${firstLegDepartureTime}</strong>発 (京都行) → 京都着 ${minutesToTime(arrivalKyotoMinutes)}<br>` +
                        `京都発 <strong><span class="math-inline">\{secondLegDepartureTime\}</strong\> \(</span>{connectingLocal.type} 西大路方面) → 西大路着 <strong>${minutesToTime(finalArrivalMinutes)}</strong> (乗り換え時間 約 ${minutesToTime(secondLegDepartureTime) - minutesToTime(arrivalKyotoMinutes)}分)`;
                    osakaNishiojiViaKyotoResults.appendChild(listItem);
                }
            });
            if (osakaNishiojiViaKyotoResults.innerHTML === '') {
                osakaNishiojiViaKyotoResults.innerHTML = '<li>現在時刻以降、乗り換え可能な組み合わせはありません。</li>';
            }
        } else {
            osakaNishiojiViaKyotoResults.innerHTML = '<li>現在時刻以降の京都方面行きはありません。</li>';
        }
    }

    function displayKyotoOsakaTimetable() {
        let html = '<table><thead><tr><th>時</th><th>分</th><th>種別・行先</th></tr></thead><tbody>';
        const groupedByHour = timetables.kyoto_to_osaka_shinkaisoku.reduce((acc, train) => {
            const hour = train.time.substring(0, 2);
            if (!acc
