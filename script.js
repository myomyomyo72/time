document.addEventListener('DOMContentLoaded', () => {
    const directionSelect = document.getElementById('direction');
    const searchButton = document.getElementById('searchButton');
    const resultsContent = document.getElementById('resultsContent');
    const kyotoOsakaTimetableDiv = document.getElementById('kyotoOsakaTimetable');

    // --- 簡易的な時刻表データ（ローカルデータ） ---
    // 実際の時刻表から抽出したごく一部のサンプルデータです。
    // 分単位で時間を比較するため、"HH:MM"形式で格納します。
    // 所要時間は仮の数値です。
    const timetables = {
        // 西大路 → 京都方面 (乗り換え用)
        nishioji_to_kyoto: [
            { time: "06:02", type: "普通" }, { time: "06:11", type: "普通" }, { time: "06:20", type: "普通" },
            { time: "06:29", type: "快速" }, { time: "07:00", type: "普通" }, { time: "07:07", type: "普通" },
            { time: "07:15", type: "普通" }, { time: "07:23", type: "快速" }, { time: "07:30", type: "普通" },
            { time: "07:39", type: "普通" }, { time: "07:45", type: "普通" }, { time: "07:54", type: "普通" },
            { time: "08:00", type: "普通" }, { time: "08:08", type: "快速" }, { time: "08:15", type: "普通" },
            { time: "08:24", type: "普通" }, { time: "08:30", type: "普通" }, { time: "08:39", type: "快速" },
            { time: "08:45", type: "普通" }, { time: "08:54", type: "普通" },
        ],
        // 西大路 → 大阪方面 (直通)
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
        // 京都 → 大阪方面 (新快速のみ抜粋)
        kyoto_to_osaka_shinkaisoku: [
            { time: "07:14", type: "新快速", destination: "姫路" }, { time: "07:29", type: "新快速", destination: "播州赤穂" },
            { time: "07:37", type: "新快速", destination: "大阪" }, { time: "07:44", type: "新快速", destination: "姫路" },
            { time: "07:59", type: "新快速", destination: "姫路" }, { time: "08:14", type: "新快速", destination: "姫路" },
            { time: "08:29", type: "新快速", destination: "姫路" }, { time: "08:44", type: "新快速", destination: "網干" },
            { time: "09:00", type: "新快速", destination: "姫路" }, { time: "09:14", type: "新快速", destination: "姫路" },
        ],
        // 大阪 → 西大路方面 (直通)
        osaka_to_nishioji_direct: [
            // 仮のデータ：大阪発の普通/快速の西大路到着時間
            { time: "06:05", type: "普通", destination: "京都" }, { time: "06:15", type: "快速", destination: "米原" },
            { time: "06:25", type: "普通", destination: "京都" }, { time: "06:35", type: "新快速", destination: "敦賀" }, // 新快速は西大路通過だが、比較のため含める
            { time: "06:45", type: "普通", destination: "京都" }, { time: "06:55", type: "快速", destination: "草津" },
            { time: "07:05", type: "普通", destination: "京都" }, { time: "07:15", type: "新快速", destination: "長浜" },
            { time: "07:25", type: "普通", destination: "京都" }, { time: "07:35", type: "快速", destination: "野洲" },
            { time: "07:45", type: "普通", destination: "京都" }, { time: "07:55", type: "新快速", destination: "米原" },
        ],
        // 大阪 → 京都 (新快速)
        osaka_to_kyoto_shinkaisoku: [
             // 大阪発の新快速の京都到着時間
            { time: "06:00", type: "新快速", destination: "敦賀" }, { time: "06:15", type: "新快速", destination: "長浜" },
            { time: "06:30", type: "新快速", destination: "米原" }, { time: "06:45", type: "新快速", destination: "敦賀" },
            { time: "07:00", type: "新快速", destination: "長浜" }, { time: "07:15", type: "新快速", destination: "米原" },
            { time: "07:30", type: "新快速", destination: "敦賀" }, { time: "07:45", type: "新快速", destination: "長浜" },
            { time: "08:00", type: "新快速", destination: "米原" }, { time: "08:15", type: "新快速", destination: "敦賀" },
        ],
        // 京都 → 西大路方面 (乗り換え用)
        kyoto_to_nishioji: [
            // 京都発の普通/快速の西大路到着時間
            { time: "06:05", type: "普通" }, { time: "06:15", type: "快速" },
            { time: "06:20", type: "普通" }, { time: "06:30", type: "普通" },
            { time: "06:40", type: "快速" }, { time: "06:50", type: "普通" },
            { time: "07:00", type: "普通" }, { time: "07:10", type: "快速" },
            { time: "07:20", type: "普通" }, { time: "07:30", type: "普通" },
            { time: "07:40", type: "快速" }, { time: "07:50", type: "普通" },
        ]
    };

    // --- 仮の所要時間（分） ---
    // 実際の運行状況や路線距離を厳密に反映していません
    const TRAVEL_TIMES = {
        nishioji_to_kyoto_local: 3, // 西大路→京都 (普通/快速)
        kyoto_to_osaka_shinkaisoku: 30, // 京都→大阪 (新快速)
        nishioji_to_osaka_local: 45, // 西大路→大阪 (普通)
        nishioji_to_osaka_rapid: 35, // 西大路→大阪 (快速)
        transfer_time: 2, // 京都駅での乗り換え時間 (分)

        osaka_to_kyoto_shinkaisoku: 30, // 大阪→京都 (新快速)
        kyoto_to_nishioji_local: 3, // 京都→西大路 (普通/快速)
        osaka_to_nishioji_local: 45, // 大阪→西大路 (普通)
        osaka_to_nishioji_rapid: 35, // 大阪→西大路 (快速)
    };

    // --- ヘルパー関数 ---

    // "HH:MM" 形式を分に変換 (日付は考慮せず、00:00からの分)
    function timeToMinutes(timeStr) {
        const [hours, minutes] = timeStr.split(':').map(Number);
        return hours * 60 + minutes;
    }

    // 分を "HH:MM" 形式に変換 (24時間を超える場合も対応)
    function minutesToTime(totalMinutes) {
        const hours = Math.floor(totalMinutes / 60) % 24; // 24時以降は0時からに
        const minutes = totalMinutes % 60;
        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
    }

    // 現在時刻から近い列車を前後2-3件取得
    function getRelevantTrains(timetable, currentTimeMinutes, count = 3) {
        let relevant = [];
        let startIndex = -1;

        // まず現在時刻より後の最初の列車を見つける
        for (let i = 0; i < timetable.length; i++) {
            if (timeToMinutes(timetable[i].time) >= currentTimeMinutes) {
                startIndex = i;
                break;
            }
        }

        if (startIndex === -1) {
            // 現在時刻より後の列車がない場合、時刻表の最後の数件を表示
            relevant = timetable.slice(Math.max(0, timetable.length - count));
        } else {
            // 現在時刻より前の列車と後の列車を合わせる
            for (let i = Math.max(0, startIndex - (count - 1)); i < Math.min(timetable.length, startIndex + count); i++) {
                 relevant.push(timetable[i]);
                 if (relevant.length === count * 2) break; // 前後計6件程度
            }
            // 表示件数を調整
            if (relevant.length > count * 2) {
                relevant = relevant.slice(0, count * 2);
            } else if (relevant.length < count * 2 && startIndex === 0) {
                 relevant = timetable.slice(0, count * 2); // 最初のほうにいる場合
            }
        }
        
        // 重複を除去し、時刻順にソートして、前後2-3件程度に絞る
        const uniqueRelevant = Array.from(new Set(relevant.map(JSON.stringify))).map(JSON.parse);
        uniqueRelevant.sort((a, b) => timeToMinutes(a.time) - timeToMinutes(b.time));
        
        const nowIdx = uniqueRelevant.findIndex(t => timeToMinutes(t.time) >= currentTimeMinutes);
        if (nowIdx !== -1) {
            // 現在時刻の前後2-3件
            const startSlice = Math.max(0, nowIdx - count);
            const endSlice = Math.min(uniqueRelevant.length, nowIdx + count);
            return uniqueRelevant.slice(startSlice, endSlice);
        } else {
            // 現在時刻より後の列車がない場合、最後の数件
            return uniqueRelevant.slice(Math.max(0, uniqueRelevant.length - count * 2));
        }
    }


    // --- ルート計算関数 ---

    function calculateNishiojiToOsaka(currentTimeMinutes) {
        resultsContent.innerHTML = '<h3>西大路 → 大阪 ルート検索結果</h3>';
        let foundResults = false;

        // ルート1: 西大路駅から普通/快速で大阪駅へ
        const directTrains = getRelevantTrains(timetables.nishioji_to_osaka_direct, currentTimeMinutes);
        if (directTrains.length > 0) {
            foundResults = true;
            directTrains.forEach(train => {
                const departureMinutes = timeToMinutes(train.time);
                let travelTime = train.type.includes("快速") ? TRAVEL_TIMES.nishioji_to_osaka_rapid : TRAVEL_TIMES.nishioji_to_osaka_local;
                const arrivalMinutes = departureMinutes + travelTime;
                resultsContent.innerHTML += `
                    <div class="route-option">
                        <h3>ルート1: 西大路から直通 ( ${train.type} )</h3>
                        <p>西大路発: <strong>${train.time}</strong> (${train.type} ${train.destination}行)</p>
                        <p>大阪着: <strong>${minutesToTime(arrivalMinutes)}</strong></p>
                        <p>所要時間: 約 <strong>${travelTime}</strong> 分</p>
                    </div>
                `;
            });
        }

        // ルート2: 西大路駅から京都駅へ行き、新快速に乗り換え大阪駅へ
        const nishiojiToKyotoTrains = getRelevantTrains(timetables.nishioji_to_kyoto, currentTimeMinutes);
        if (nishiojiToKyotoTrains.length > 0) {
            foundResults = true;
            nishiojiToKyotoTrains.forEach(firstLegTrain => {
                const firstLegDepartureMinutes = timeToMinutes(firstLegTrain.time);
                const arrivalKyotoMinutes = firstLegDepartureMinutes + TRAVEL_TIMES.nishioji_to_kyoto_local; // 西大路→京都の所要時間

                // 京都駅で乗り換え可能な新快速を探す
                const earliestKyotoDepartureMinutes = arrivalKyotoMinutes + TRAVEL_TIMES.transfer_time;
                const connectingShinKaisoku = timetables.kyoto_to_osaka_shinkaisoku.find(
                    skTrain => timeToMinutes(skTrain.time) >= earliestKyotoDepartureMinutes
                );

                if (connectingShinKaisoku) {
                    const secondLegDepartureMinutes = timeToMinutes(connectingShinKaisoku.time);
                    const finalArrivalMinutes = secondLegDepartureMinutes + TRAVEL_TIMES.kyoto_to_osaka_shinkaisoku;
                    const totalTravelTime = finalArrivalMinutes - firstLegDepartureMinutes;

                    resultsContent.innerHTML += `
                        <div class="route-option">
                            <h3>ルート2: 西大路 → 京都 (乗り換え) → 大阪 (新快速)</h3>
                            <p>西大路発: <strong>${firstLegTrain.time}</strong> (${firstLegTrain.type} 京都行)</p>
                            <p>京都着: ${minutesToTime(arrivalKyotoMinutes)}</p>
                            <p>京都発 (新快速): <strong>${connectingShinKaisoku.time}</strong> (${connectingShinKaisoku.type} ${connectingShinKaisoku.destination}行)</p>
                            <p>大阪着: <strong>${minutesToTime(finalArrivalMinutes)}</strong></p>
                            <p>所要時間: 約 <strong>${totalTravelTime}</strong> 分</p>
                            <p>（京都での乗り換え時間: 約 ${secondLegDepartureMinutes - arrivalKyotoMinutes}分）</p>
                        </div>
                    `;
                }
            });
        }

        if (!foundResults) {
            resultsContent.innerHTML += '<p>現在時刻から近い列車情報が見つかりませんでした。</p>';
        }
    }

    function calculateOsakaToNishioji(currentTimeMinutes) {
        resultsContent.innerHTML = '<h3>大阪 → 西大路 ルート検索結果</h3>';
        let foundResults = false;

        // ルート1: 大阪駅から普通/快速で西大路駅へ (直通)
        const directTrains = getRelevantTrains(timetables.osaka_to_nishioji_direct, currentTimeMinutes);
        if (directTrains.length > 0) {
            foundResults = true;
            directTrains.forEach(train => {
                const departureMinutes = timeToMinutes(train.time);
                let travelTime = train.type.includes("快速") ? TRAVEL_TIMES.osaka_to_nishioji_rapid : TRAVEL_TIMES.osaka_to_nishioji_local;
                const arrivalMinutes = departureMinutes + travelTime;
                resultsContent.innerHTML += `
                    <div class="route-option">
                        <h3>ルート1: 大阪から直通 ( ${train.type} )</h3>
                        <p>大阪発: <strong>${train.time}</strong> (${train.type} ${train.destination}行)</p>
                        <p>西大路着: <strong>${minutesToTime(arrivalMinutes)}</strong></p>
                        <p>所要時間: 約 <strong>${travelTime}</strong> 分</p>
                    </div>
                `;
            });
        }

        // ルート2: 大阪駅から京都駅へ行き、普通/快速に乗り換え西大路駅へ
        const osakaToKyotoTrains = getRelevantTrains(timetables.osaka_to_kyoto_shinkaisoku, currentTimeMinutes);
        if (osakaToKyotoTrains.length > 0) {
            foundResults = true;
            osakaToKyotoTrains.forEach(firstLegTrain => {
                const firstLegDepartureMinutes = timeToMinutes(firstLegTrain.time);
                const arrivalKyotoMinutes = firstLegDepartureMinutes + TRAVEL_TIMES.osaka_to_kyoto_shinkaisoku; // 大阪→京都の所要時間

                // 京都駅で乗り換え可能な普通/快速を探す
                const earliestKyotoDepartureMinutes = arrivalKyotoMinutes + TRAVEL_TIMES.transfer_time;
                const connectingLocal = timetables.kyoto_to_nishioji.find(
                    localTrain => timeToMinutes(localTrain.time) >= earliestKyotoDepartureMinutes
                );

                if (connectingLocal) {
                    const secondLegDepartureMinutes = timeToMinutes(connectingLocal.time);
                    const finalArrivalMinutes = secondLegDepartureMinutes + TRAVEL_TIMES.kyoto_to_nishioji_local;
                    const totalTravelTime = finalArrivalMinutes - firstLegDepartureMinutes;

                    resultsContent.innerHTML += `
                        <div class="route-option">
                            <h3>ルート2: 大阪 → 京都 (乗り換え) → 西大路</h3>
                            <p>大阪発: <strong>${firstLegTrain.time}</strong> (${firstLegTrain.type} ${firstLegTrain.destination}行)</p>
                            <p>京都着: ${minutesToTime(arrivalKyotoMinutes)}</p>
                            <p>京都発 (${connectingLocal.type}): <strong>${connectingLocal.time}</strong> (${connectingLocal.type} 西大路方面)</p>
                            <p>西大路着: <strong>${minutesToTime(finalArrivalMinutes)}</strong></p>
                            <p>所要時間: 約 <strong>${totalTravelTime}</strong> 分</p>
                            <p>（京都での乗り換え時間: 約 ${secondLegDepartureMinutes - arrivalKyotoMinutes}分）</p>
                        </div>
                    `;
                }
            });
        }

        if (!foundResults) {
            resultsContent.innerHTML += '<p>現在時刻から近い列車情報が見つかりませんでした。</p>';
        }
    }


    // 京都駅 (大阪方面) の時刻表を表示する関数
    function displayKyotoOsakaTimetable() {
        let html = '<table><thead><tr><th>時</th><th>分</th><th>種別・行先</th></tr></thead><tbody>';
        const groupedByHour = timetables.kyoto_to_osaka_shinkaisoku.reduce((acc, train) => {
            const hour = train.time.substring(0, 2);
            if (!acc[hour]) {
                acc[hour] = [];
            }
            acc[hour].push(train);
            return acc;
        }, {});

        for (const hour in groupedByHour) {
            html += `<tr><td rowspan="${groupedByHour[hour].length + 1}">${hour}</td>`; // 1行目用に+1
            groupedByHour[hour].forEach((train, index) => {
                const min = train.time.substring(3, 5);
                if (index === 0) {
                    html += `<td>${min}</td><td>${train.type} ${train.destination}行</td></tr>`;
                } else {
                    html += `<tr><td>${min}</td><td>${train.type} ${train.destination}行</td></tr>`;
                }
            });
        }
        html += '</tbody></table>';
        kyotoOsakaTimetableDiv.innerHTML = html;
    }

    // --- イベントリスナー ---

    searchButton.addEventListener('click', () => {
        const selectedDirection = directionSelect.value;
        const now = new Date();
        const currentTimeMinutes = now.getHours() * 60 + now.getMinutes();

        if (selectedDirection === 'nishioji_osaka') {
            calculateNishiojiToOsaka(currentTimeMinutes);
        } else if (selectedDirection === 'osaka_nishioji') {
            calculateOsakaToNishioji(currentTimeMinutes);
        }
    });

    // 初期表示
    displayKyotoOsakaTimetable();
    // ページロード時にデフォルトの検索を実行
    const now = new Date();
    const currentTimeMinutes = now.getHours() * 60 + now.getMinutes();
    calculateNishiojiToOsaka(currentTimeMinutes);
});