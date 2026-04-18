// ============================
//  KEYREER - Step 3: Career Matrix
//  Reads data from localStorage (keyreer_result + keyreer_profile)
//  and renders a personalized career matrix.
// ============================

document.addEventListener('DOMContentLoaded', () => {
    const careerNodesContainer = document.getElementById('career-nodes');

    // ============================
    //  FULL CAREER DATABASE
    //  Keyed by group (matches Step 2 groupInfo keys)
    // ============================
    const careerDatabase = {
        creative: [
            { name: "Nhà thiết kế đồ họa", color: "purple" },
            { name: "Content Creator", color: "purple" },
            { name: "UX/UI Designer", color: "purple" },
            { name: "Nhiếp ảnh gia", color: "purple" },
            { name: "Biên kịch / Copywriter", color: "purple" },
            { name: "Art Director", color: "purple" },
            { name: "Video Editor", color: "purple" },
            { name: "Motion Designer", color: "purple" },
            { name: "Brand Strategist", color: "purple" },
        ],
        leader: [
            { name: "Quản lý dự án", color: "blue" },
            { name: "Doanh nhân / Founder", color: "blue" },
            { name: "Sales Manager", color: "blue" },
            { name: "PR & Truyền thông", color: "blue" },
            { name: "Product Manager", color: "blue" },
            { name: "CEO / Giám đốc", color: "blue" },
            { name: "Business Developer", color: "blue" },
            { name: "Marketing Manager", color: "blue" },
            { name: "Chuyên viên chiến lược", color: "blue" },
        ],
        social: [
            { name: "Giáo viên / Giảng viên", color: "green" },
            { name: "Tư vấn tâm lý", color: "green" },
            { name: "Công tác xã hội", color: "green" },
            { name: "Nhân sự (HR)", color: "green" },
            { name: "NGO / Phi lợi nhuận", color: "green" },
            { name: "Y tế cộng đồng", color: "green" },
            { name: "Life Coach", color: "green" },
            { name: "Chuyên gia đào tạo", color: "green" },
            { name: "Trị liệu viên", color: "green" },
        ],
        order: [
            { name: "Kế toán / Kiểm toán", color: "orange" },
            { name: "Hành chính – Văn phòng", color: "orange" },
            { name: "Quản lý chất lượng (QA)", color: "orange" },
            { name: "Luật sư / Pháp chế", color: "orange" },
            { name: "Ngân hàng", color: "orange" },
            { name: "Business Analyst", color: "orange" },
            { name: "Operations Manager", color: "orange" },
            { name: "Compliance Officer", color: "orange" },
            { name: "Project Coordinator", color: "orange" },
        ],
        analyst: [
            { name: "Data Analyst / Scientist", color: "blue" },
            { name: "Nghiên cứu viên", color: "blue" },
            { name: "Kỹ sư phần mềm", color: "blue" },
            { name: "Chuyên gia AI/ML", color: "blue" },
            { name: "Bác sĩ / Dược sĩ", color: "blue" },
            { name: "Nhà khoa học", color: "blue" },
            { name: "Chuyên gia tư vấn chiến lược", color: "blue" },
            { name: "Financial Analyst", color: "blue" },
            { name: "Risk Analyst", color: "blue" },
        ],
        technical: [
            { name: "Kỹ sư cơ khí", color: "orange" },
            { name: "Kỹ thuật viên", color: "orange" },
            { name: "Kiến trúc sư", color: "orange" },
            { name: "Lập trình viên", color: "orange" },
            { name: "Kỹ sư xây dựng", color: "orange" },
            { name: "Kỹ sư điện tử", color: "orange" },
            { name: "DevOps Engineer", color: "orange" },
            { name: "Network Engineer", color: "orange" },
            { name: "Robotics Engineer", color: "orange" },
        ]
    };

    const groupMeta = {
        creative: { name: "Sáng Tạo & Nghệ Thuật", icon: "🎨" },
        leader:   { name: "Lãnh Đạo & Kinh Doanh",  icon: "🚀" },
        social:   { name: "Hỗ Trợ & Cộng Đồng",     icon: "🤝" },
        order:    { name: "Tổ Chức & Hành Chính",    icon: "📋" },
        analyst:  { name: "Phân Tích & Nghiên Cứu",  icon: "🔬" },
        technical:{ name: "Kỹ Thuật & Thực Hành",   icon: "🔧" },
    };

    // ============================
    //  LOAD DATA FROM LOCALSTORAGE
    // ============================
    let result = null;
    try {
        result = JSON.parse(localStorage.getItem('keyreer_result'));
    } catch(e) {}

    // ============================
    //  BUILD PERSONALIZED CAREER LIST
    //  Top 3 groups -> "Cao", next 2 -> "Trung bình", rest -> "Thấp"
    //  Pick careers from top groups first
    // ============================
    function buildPersonalizedCareers(result) {
        if (!result || !result.sorted) {
            // Fallback: default data nếu chưa làm test
            return [
                { name: "Data Analyst", fitLevel: "Cao",        reason: "Phù hợp với tư duy phân tích và logic của bạn.", color: "blue", group: "analyst" },
                { name: "Product Manager", fitLevel: "Cao",     reason: "Kết hợp tốt kỹ năng lãnh đạo và phân tích.", color: "blue", group: "leader" },
                { name: "UX/UI Designer", fitLevel: "Cao",      reason: "Phù hợp với khả năng sáng tạo của bạn.", color: "purple", group: "creative" },
                { name: "Business Analyst", fitLevel: "Trung bình", reason: "Tận dụng kỹ năng tổ chức và phân tích.", color: "orange", group: "order" },
                { name: "Giáo viên", fitLevel: "Trung bình",   reason: "Phù hợp với thiên hướng hỗ trợ cộng đồng.", color: "green", group: "social" },
                { name: "Kỹ sư phần mềm", fitLevel: "Trung bình", reason: "Cần đầu tư thêm vào kỹ năng kỹ thuật.", color: "orange", group: "technical" },
                { name: "Doanh nhân", fitLevel: "Thấp",         reason: "Cần phát triển thêm kỹ năng kinh doanh.", color: "blue", group: "leader" },
                { name: "Nghiên cứu viên", fitLevel: "Thấp",    reason: "Đòi hỏi chuyên môn sâu hơn.", color: "blue", group: "analyst" },
                { name: "Kỹ sư cơ khí", fitLevel: "Thấp",      reason: "Yêu cầu các kỹ năng kỹ thuật chuyên biệt.", color: "orange", group: "technical" },
                { name: "Content Creator", fitLevel: "Thấp",    reason: "Cần rèn luyện thêm kỹ năng sáng tạo nội dung.", color: "purple", group: "creative" },
                { name: "HR Manager", fitLevel: "Thấp",         reason: "Phát triển thêm kỹ năng quản lý nhân sự.", color: "green", group: "social" },
                { name: "Kế toán", fitLevel: "Thấp",            reason: "Đòi hỏi tư duy hành chính cụ thể hơn.", color: "orange", group: "order" },
            ];
        }

        const sorted = result.sorted; // e.g. ['creative', 'leader', 'analyst', ...]
        const scores = result.scores;

        const fitMap = {};
        sorted.forEach((g, idx) => {
            if (idx === 0) fitMap[g] = 'Cao';
            else if (idx <= 2) fitMap[g] = 'Trung bình';
            else fitMap[g] = 'Thấp';
        });

        // Build reason per fit level
        const reasons = {
            'Cao': 'Điểm số của bạn cho thấy sự phù hợp rất cao với lĩnh vực này.',
            'Trung bình': 'Kết hợp tốt giữa kỹ năng hiện có và sở thích cá nhân.',
            'Thấp': 'Yêu cầu các kỹ năng bạn có thể phát triển thêm.'
        };

        const careers = [];
        // For each group in sorted order, pick 2 careers from its database
        sorted.forEach(g => {
            const db = careerDatabase[g] || [];
            const level = fitMap[g];
            const pct = scores[g];

            // Pick top 2 from the group
            const picked = db.slice(0, 2);
            picked.forEach(c => {
                careers.push({
                    ...c,
                    fitLevel: level,
                    group: g,
                    reason: reasons[level] + ` (Điểm ${groupMeta[g]?.name || g}: ${pct}%)`,
                    pct: pct
                });
            });
        });

        return careers;
    }

    // ============================
    //  BUILD STRENGTH ANALYSIS TEXT
    // ============================
    function buildStrengthsText(result) {
        if (!result || !result.sorted) {
            return {
                title: "Phân tích chi tiết bản thân",
                text: "Làm bài trắc nghiệm ở Bước 2 để xem phân tích cá nhân của bạn."
            };
        }

        const profile = result.profile || {};
        const topGroup = result.topGroup;
        const secondGroup = result.secondGroup;
        const topDetail = result.groupDetails?.[topGroup];
        const secondDetail = result.groupDetails?.[secondGroup];

        const topMeta = groupMeta[topGroup] || {};
        const secondMeta = groupMeta[secondGroup] || {};

        let intro = '';
        if (profile.role) {
            intro = `Là một **${profile.role}`;
            if (profile.subjects) intro += ` với thế mạnh về ${profile.subjects}`;
            if (profile.major) intro += ` ngành ${profile.major}`;
            if (profile.position) intro += ` từng là ${profile.position}`;
            intro += '**, ';
        }

        const strengthList = topDetail?.strengths?.slice(0, 2).join(' và ') || 'nhiều điểm mạnh nổi bật';
        const topPct = topDetail?.pct || 0;
        const secondPct = secondDetail?.pct || 0;

        const text = `${intro}kết quả trắc nghiệm cho thấy bạn có xu hướng mạnh nhất về **${topMeta.icon} ${topMeta.name}** (${topPct}%) và **${secondMeta.icon} ${secondMeta.name}** (${secondPct}%). \\n\\nBạn nổi bật với khả năng **${strengthList}**.${profile.interests ? ` Mối quan tâm của bạn về "${profile.interests}" là lợi thế lớn trong lĩnh vực này.` : ''} \\n\\nMa trận nghề nghiệp bên dưới được xây dựng riêng cho hồ sơ của bạn — những nghề ở vòng trong là phù hợp nhất.`;

        return {
            title: `${topMeta.icon} Phân tích bản thân`,
            text: text
        };
    }

    // ============================
    //  PLACE NODES ON MATRIX
    // ============================
    function placeNodes() {
        if (!careerNodesContainer) return;
        careerNodesContainer.innerHTML = '';

        const careers = buildPersonalizedCareers(result);

        // Assign to rings by fitLevel
        const highCareers   = careers.filter(c => c.fitLevel === 'Cao');
        const medCareers    = careers.filter(c => c.fitLevel === 'Trung bình');
        const lowCareers    = careers.filter(c => c.fitLevel === 'Thấp');

        const centerX = 50;
        const centerY = 50;
        const isMobile = window.innerWidth <= 768;

        let rings;
        if (isMobile) {
            rings = [
                { level: 'Cao',        items: highCareers, rx: 12, ry: 18 },
                { level: 'Trung bình', items: medCareers,  rx: 28, ry: 34 },
                { level: 'Thấp',       items: lowCareers,  rx: 38, ry: 45 },
            ];
        } else {
            rings = [
                { level: 'Cao',        items: highCareers, rx: 15, ry: 22 },
                { level: 'Trung bình', items: medCareers,  rx: 28, ry: 36 },
                { level: 'Thấp',       items: lowCareers,  rx: 38, ry: 48 },
            ];
        }

        rings.forEach((ring, ringIdx) => {
            const count = ring.items.length;
            if (count === 0) return;
            const angleStep = (2 * Math.PI) / count;
            const startAngle = ringIdx * (Math.PI / 4.5);

            ring.items.forEach((career, i) => {
                const angle = startAngle + (i * angleStep) + (Math.random() * 0.15 - 0.07);
                const x = centerX + ring.rx * Math.cos(angle);
                const y = centerY + ring.ry * Math.sin(angle);

                let dirClass = '';
                if (!isMobile) {
                    dirClass = x < 50 ? 'node-left' : 'node-right';
                } else {
                    dirClass = y < 50 ? 'node-top' : 'node-bottom';
                }

                const wrapper = document.createElement('div');
                wrapper.className = 'node-wrapper';
                wrapper.style.left = `${x}%`;
                wrapper.style.top = `${y}%`;

                wrapper.innerHTML = `
                    <div class="node-animator" style="animation: float ${4 + Math.random() * 3}s ease-in-out infinite alternate; animation-delay: ${Math.random() * 5}s;">
                        <div class="career-node ${dirClass}">
                            <div class="node-dot ${career.color}"></div>
                            <div class="node-label">${career.name}</div>
                            <div class="node-tooltip">
                                <strong class="tooltip-title">Độ phù hợp: ${ring.level}</strong>
                                <p class="tooltip-desc">${career.reason}</p>
                                <a href="timeline.html?career=${encodeURIComponent(career.name)}" class="tooltip-btn">Xem chi tiết</a>
                            </div>
                        </div>
                    </div>
                `;

                wrapper.querySelector('.node-dot').addEventListener('click', () => {
                    localStorage.setItem('selectedCareer', career.name);
                    localStorage.setItem('selectedCareerGroup', career.group);
                    // Update tab links
                    const tabDetail = document.getElementById('tab-detail');
                    const tabRoadmap = document.getElementById('tab-roadmap');
                    if (tabDetail) tabDetail.onclick = () => location.href = `timeline.html?career=${encodeURIComponent(career.name)}`;
                    if (tabRoadmap) tabRoadmap.onclick = () => location.href = `roadmap.html?career=${encodeURIComponent(career.name)}`;
                });

                careerNodesContainer.appendChild(wrapper);
            });
        });

        // Set up tab links based on saved career
        const lastCareer = localStorage.getItem('selectedCareer');
        if (lastCareer) {
            const tabDetail = document.getElementById('tab-detail');
            const tabRoadmap = document.getElementById('tab-roadmap');
            if (tabDetail) tabDetail.onclick = () => location.href = `timeline.html?career=${encodeURIComponent(lastCareer)}`;
            if (tabRoadmap) tabRoadmap.onclick = () => location.href = `roadmap.html?career=${encodeURIComponent(lastCareer)}`;
        } else {
            [document.getElementById('tab-detail'), document.getElementById('tab-roadmap')].forEach(tab => {
                if (tab) tab.onclick = () => alert('Vui lòng chọn một nghề nghiệp trên ma trận trước!');
            });
        }
    }

    // ============================
    //  HUB: STRENGTH MODAL
    // ============================
    const hub = document.querySelector('.central-hub');
    const modal = document.getElementById('strengths-modal');
    const closeBtn = document.querySelector('.close-modal');
    const titleEl = document.getElementById('typing-title');
    const textEl = document.getElementById('typing-text');

    // Update central hub text based on result
    const hubContent = document.querySelector('.hub-content p');
    if (hubContent && result) {
        const topMeta = groupMeta[result.topGroup] || {};
        hubContent.innerHTML = `${topMeta.icon}<br><small>${topMeta.name}</small><br><span style="font-size:0.65rem;opacity:0.7">Nhấn để xem phân tích</span>`;
    }

    const strengthsData = buildStrengthsText(result);

    function displayStrengths() {
        if (!titleEl || !textEl) return;
        titleEl.textContent = strengthsData.title;
        let formattedText = strengthsData.text
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\\n/g, '<br>');
        textEl.innerHTML = formattedText;
    }

    if (hub && modal) {
        hub.addEventListener('click', () => {
            const rect = hub.getBoundingClientRect();
            modal.style.top = `${rect.top}px`;
            modal.style.left = `${rect.left}px`;
            modal.style.width = `${rect.width}px`;
            modal.style.height = `${rect.height}px`;
            modal.style.borderRadius = '50%';
            modal.style.opacity = '1';
            displayStrengths();
            void modal.offsetWidth;
            modal.classList.add('active');
        });

        const closeModal = () => {
            const rect = hub.getBoundingClientRect();
            modal.classList.remove('active');
            modal.style.top = `${rect.top}px`;
            modal.style.left = `${rect.left}px`;
            modal.style.width = `${rect.width}px`;
            modal.style.height = `${rect.height}px`;
            modal.style.borderRadius = '50%';
            modal.style.opacity = '0';
        };

        if (closeBtn) closeBtn.addEventListener('click', closeModal);
        window.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
    }

    // ============================
    //  INIT
    // ============================
    placeNodes();
    window.addEventListener('resize', () => {
        clearTimeout(window.resizeTimer);
        window.resizeTimer = setTimeout(placeNodes, 500);
    });

    // Float animation
    const floatStyle = document.createElement('style');
    floatStyle.innerHTML = `
        @keyframes float {
            0% { transform: translateY(0px) translateX(0px); }
            100% { transform: translateY(-10px) translateX(5px); }
        }
    `;
    document.head.appendChild(floatStyle);
});
