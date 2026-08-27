
// =========================================================
// CONFIGURAÇÃO DA API
// =========================================================

const API_URL = 'http://localhost:8080';
const FUNCIONARIOS_URL = `${API_URL}/funcionarios`;

// =========================================================
// ESTADO DA APLICAÇÃO
// =========================================================

let state = {
    currentRoute: 'dashboard',
    funcionarios: [],
    activities: [
        {
            id: 1,
            text: "Sistema inicializado.",
            time: new Date().toISOString(),
            type: 'info'
        }
    ],
    searchQuery: '',
    filterStatus: 'ALL'
};

// =========================================================
// UTILITÁRIOS
// =========================================================

const formatCurrency = (value) =>
    new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(value || 0);

const getInitials = (name) => {
    if (!name) return '--';

    const parts = name.trim().split(' ');

    if (parts.length >= 2) {
        return (parts[0][0] + parts[1][0]).toUpperCase();
    }

    return name.substring(0, 2).toUpperCase();
};

const getStatusConfig = (status) => {
    const configs = {
        'EM_ANALISE': {
            label: 'Em Análise',
            class: 'badge-analise',
            icon: 'clock'
        },
        'APROVADO': {
            label: 'Aprovado',
            class: 'badge-aprovado',
            icon: 'check-circle'
        },
        'REPROVADO': {
            label: 'Reprovado',
            class: 'badge-reprovado',
            icon: 'x-circle'
        },
        'CONTRATADO': {
            label: 'Contratado',
            class: 'badge-contratado',
            icon: 'briefcase'
        }
    };

    return configs[status] || {
        label: status || 'Desconhecido',
        class: 'bg-gray-100 text-gray-800',
        icon: 'help-circle'
    };
};

// =========================================================
// TOAST
// =========================================================

function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');

    const bgClass =
        type === 'success'
            ? 'bg-pp-main'
            : type === 'error'
                ? 'bg-red-500'
                : 'bg-gray-800';

    const icon =
        type === 'success'
            ? 'check-circle'
            : type === 'error'
                ? 'alert-circle'
                : 'info';

    toast.className =
        `flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg text-white ${bgClass} fade-in slide-in-right transform transition-all duration-300`;

    toast.innerHTML = `
            <i data-lucide="${icon}" class="w-5 h-5"></i>
            <span class="text-sm font-medium">${message}</span>
        `;

    container.appendChild(toast);

    lucide.createIcons({
        root: toast
    });

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(100%)';

        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 3000);
}

// =========================================================
// ATIVIDADES
// =========================================================

function logActivity(text, type = 'info') {
    state.activities.unshift({
        id: Date.now(),
        text: text,
        time: new Date().toISOString(),
        type: type
    });

    if (state.activities.length > 10) {
        state.activities.pop();
    }

    if (state.currentRoute === 'dashboard') {
        renderDashboard();
    }
}

// =========================================================
// API - GET TODOS
// =========================================================

async function carregarFuncionarios() {
    try {
        const response = await fetch(FUNCIONARIOS_URL);

        if (!response.ok) {
            throw new Error(`Erro HTTP ${response.status}`);
        }

        const dados = await response.json();

        state.funcionarios = Array.isArray(dados)
            ? dados
            : [];

        if (state.currentRoute === 'dashboard') {
            renderDashboard();
        } else if (state.currentRoute === 'candidatos') {
            renderCandidatos();
        }

    } catch (error) {
        console.error('Erro ao buscar funcionários:', error);

        state.funcionarios = [];

        showToast(
            'Não foi possível conectar com a API.',
            'error'
        );
    }
}

// =========================================================
// NAVEGAÇÃO
// =========================================================

function navigate(route) {
    state.currentRoute = route;

    // Atualiza menu ativo
    document.querySelectorAll('.nav-item').forEach(el => {
        el.classList.remove(
            'active',
            'bg-pp-mint',
            'text-pp-dark',
            'border-r-4',
            'border-pp-main'
        );

        el.classList.add(
            'text-ui-graydark',
            'hover:bg-ui-offwhite',
            'hover:text-ui-black'
        );
    });

    const activeLink = document.querySelector(
        `.nav-item[onclick="navigate('${route}')"]`
    );

    if (activeLink) {
        activeLink.classList.remove(
            'text-ui-graydark',
            'hover:bg-ui-offwhite',
            'hover:text-ui-black'
        );

        activeLink.classList.add(
            'active',
            'bg-pp-mint',
            'text-pp-dark',
            'border-r-4',
            'border-pp-main'
        );
    }

    // Fecha menu mobile
    document.getElementById('sidebar').classList.remove('translate-x-0');
    document.getElementById('sidebar').classList.add('-translate-x-full');

    const contentArea = document.getElementById('app-content');

    contentArea.innerHTML = '';

    contentArea.className =
        'flex-1 overflow-y-auto p-4 sm:p-8 relative fade-in';

    // Renderiza página
    switch (route) {
        case 'dashboard':
            document.getElementById('page-title').innerText =
                'Dashboard de Recrutamento';

            renderDashboard();
            break;

        case 'candidatos':
            document.getElementById('page-title').innerText =
                'Gestão de Candidatos';

            renderCandidatos();
            break;

        case 'relatorios':
            document.getElementById('page-title').innerText =
                'Relatórios Gerenciais';

            renderRelatorios();
            break;

        case 'configuracoes':
            document.getElementById('page-title').innerText =
                'Configurações do Sistema';

            renderConfiguracoes();
            break;
    }

    lucide.createIcons();
}

// =========================================================
// DASHBOARD
// =========================================================

function renderDashboard() {
    const content = document.getElementById('app-content');
    const funcs = state.funcionarios;

    const total = funcs.length;

    const emAnalise =
        funcs.filter(f => f.status === 'EM_ANALISE').length;

    const aprovados =
        funcs.filter(f => f.status === 'APROVADO').length;

    const reprovados =
        funcs.filter(f => f.status === 'REPROVADO').length;

    const contratados =
        funcs.filter(f => f.status === 'CONTRATADO').length;

    const calcPct = (val) =>
        total === 0
            ? 0
            : Math.round((val / total) * 100);

    const html = `
            <!-- Metrics Grid -->
            <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">

                <div class="bg-white p-5 rounded-2xl shadow-soft border border-gray-100 flex flex-col justify-between">
                    <div class="flex justify-between items-start mb-2">
                        <p class="text-sm font-medium text-ui-graydark">
                            Total
                        </p>

                        <div class="p-2 bg-gray-100 rounded-lg text-gray-600">
                            <i data-lucide="users" class="w-4 h-4"></i>
                        </div>
                    </div>

                    <h3 class="text-3xl font-bold text-ui-black">
                        ${total}
                    </h3>
                </div>

                <div class="bg-white p-5 rounded-2xl shadow-soft border border-gray-100 border-l-4 border-l-orange-400">
                    <div class="flex justify-between items-start mb-2">
                        <p class="text-sm font-medium text-ui-graydark">
                            Em Análise
                        </p>

                        <div class="p-2 bg-orange-50 rounded-lg text-orange-500">
                            <i data-lucide="clock" class="w-4 h-4"></i>
                        </div>
                    </div>

                    <h3 class="text-3xl font-bold text-ui-black">
                        ${emAnalise}
                    </h3>
                </div>

                <div class="bg-white p-5 rounded-2xl shadow-soft border border-gray-100 border-l-4 border-l-pp-main">
                    <div class="flex justify-between items-start mb-2">
                        <p class="text-sm font-medium text-ui-graydark">
                            Aprovados
                        </p>

                        <div class="p-2 bg-pp-mint rounded-lg text-pp-dark">
                            <i data-lucide="check-circle" class="w-4 h-4"></i>
                        </div>
                    </div>

                    <h3 class="text-3xl font-bold text-ui-black">
                        ${aprovados}
                    </h3>
                </div>

                <div class="bg-white p-5 rounded-2xl shadow-soft border border-gray-100 border-l-4 border-l-red-500">
                    <div class="flex justify-between items-start mb-2">
                        <p class="text-sm font-medium text-ui-graydark">
                            Reprovados
                        </p>

                        <div class="p-2 bg-red-50 rounded-lg text-red-500">
                            <i data-lucide="x-circle" class="w-4 h-4"></i>
                        </div>
                    </div>

                    <h3 class="text-3xl font-bold text-ui-black">
                        ${reprovados}
                    </h3>
                </div>

                <div class="bg-pp-main text-white p-5 rounded-2xl shadow-soft shadow-pp-main/20 flex flex-col justify-between">

                    <div class="flex justify-between items-start mb-2">

                        <p class="text-sm font-medium text-white/90">
                            Contratados
                        </p>

                        <div class="p-2 bg-black/10 rounded-lg text-white">
                            <i data-lucide="briefcase" class="w-4 h-4"></i>
                        </div>

                    </div>

                    <h3 class="text-3xl font-bold">
                        ${contratados}
                    </h3>

                </div>

            </div>

            <!-- Gráficos -->
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">

                <!-- Distribuição -->
                <div class="bg-white p-6 rounded-2xl shadow-soft border border-gray-100 lg:col-span-2">

                    <h3 class="text-lg font-bold text-ui-black mb-6">
                        Distribuição de Status
                    </h3>

                    <div class="space-y-4">

                        <div>

                            <div class="flex justify-between text-sm mb-1">
                                <span class="font-medium text-ui-graydark">
                                    Em Análise
                                </span>

                                <span class="font-bold text-ui-black">
                                    ${calcPct(emAnalise)}%
                                </span>
                            </div>

                            <div class="w-full bg-gray-100 rounded-full h-2.5">

                                <div
                                    class="bg-orange-400 h-2.5 rounded-full"
                                    style="width: ${calcPct(emAnalise)}%"
                                ></div>

                            </div>

                        </div>

                        <div>

                            <div class="flex justify-between text-sm mb-1">
                                <span class="font-medium text-ui-graydark">
                                    Aprovados
                                </span>

                                <span class="font-bold text-ui-black">
                                    ${calcPct(aprovados)}%
                                </span>
                            </div>

                            <div class="w-full bg-gray-100 rounded-full h-2.5">

                                <div
                                    class="bg-pp-light h-2.5 rounded-full"
                                    style="width: ${calcPct(aprovados)}%"
                                ></div>

                            </div>

                        </div>

                        <div>

                            <div class="flex justify-between text-sm mb-1">
                                <span class="font-medium text-ui-graydark">
                                    Contratados
                                </span>

                                <span class="font-bold text-ui-black">
                                    ${calcPct(contratados)}%
                                </span>
                            </div>

                            <div class="w-full bg-gray-100 rounded-full h-2.5">

                                <div
                                    class="bg-pp-main h-2.5 rounded-full"
                                    style="width: ${calcPct(contratados)}%"
                                ></div>

                            </div>

                        </div>

                        <div>

                            <div class="flex justify-between text-sm mb-1">
                                <span class="font-medium text-ui-graydark">
                                    Reprovados
                                </span>

                                <span class="font-bold text-ui-black">
                                    ${calcPct(reprovados)}%
                                </span>
                            </div>

                            <div class="w-full bg-gray-100 rounded-full h-2.5">

                                <div
                                    class="bg-red-400 h-2.5 rounded-full"
                                    style="width: ${calcPct(reprovados)}%"
                                ></div>

                            </div>

                        </div>

                    </div>

                </div>

                <!-- Atividades -->
                <div class="bg-white p-6 rounded-2xl shadow-soft border border-gray-100">

                    <h3 class="text-lg font-bold text-ui-black mb-6 flex items-center gap-2">

                        <i
                            data-lucide="activity"
                            class="w-5 h-5 text-pp-main"
                        ></i>

                        Atividade Recente

                    </h3>

                    <div class="space-y-4 relative pl-6">

                        ${state.activities.map(act => `

                            <div class="relative">

                                <div
                                    class="w-5 h-5 rounded-full border-2 border-white
                                    ${act.text.includes('removido')
            ? 'bg-red-500'
            : 'bg-pp-main'}
                                    absolute -left-6"
                                ></div>

                                <div class="bg-ui-offwhite p-3 rounded-xl border border-gray-100 w-full">

                                    <p class="text-sm text-ui-black font-medium">
                                        ${act.text}
                                    </p>

                                    <time class="text-xs text-ui-graymed mt-1 block">

                                        ${new Date(act.time).toLocaleTimeString(
                'pt-BR',
                {
                    hour: '2-digit',
                    minute: '2-digit'
                }
            )}

                                    </time>

                                </div>

                            </div>

                        `).join('')}

                    </div>

                </div>

            </div>

            <!-- Métodos HTTP -->
            <div class="mb-8">

                <h3 class="text-xl font-bold text-ui-black mb-4">
                    Como o sistema funciona (Conceitos REST)
                </h3>

                <p class="text-ui-graydark text-sm mb-6 max-w-3xl">
                    Este projeto demonstra as operações básicas de um CRUD
                    mapeadas para métodos HTTP.
                </p>

                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">

                    ${renderHTTPCard(
                'GET',
                'bg-blue-100 text-blue-700',
                'bg-blue-50 border-blue-200',
                '/funcionarios',
                'Busca e lista todos os candidatos.'
            )}

                    ${renderHTTPCard(
                'POST',
                'bg-green-100 text-green-700',
                'bg-green-50 border-green-200',
                '/funcionarios',
                'Cria um novo registro.'
            )}

                    ${renderHTTPCard(
                'PUT',
                'bg-yellow-100 text-yellow-700',
                'bg-yellow-50 border-yellow-200',
                '/funcionarios/{id}',
                'Atualiza todos os dados de um registro.'
            )}

                    ${renderHTTPCard(
                'PATCH',
                'bg-orange-100 text-orange-700',
                'bg-orange-50 border-orange-200',
                '/funcionarios/{id}',
                'Atualiza apenas parte do registro.'
            )}

                    ${renderHTTPCard(
                'DELETE',
                'bg-red-100 text-red-700',
                'bg-red-50 border-red-200',
                '/funcionarios/{id}',
                'Remove um registro.'
            )}

                </div>

            </div>
        `;

    content.innerHTML = html;

    lucide.createIcons({
        root: content
    });
}

// =========================================================
// CARD HTTP
// =========================================================

function renderHTTPCard(
    method,
    badgeClass,
    cardClass,
    endpoint,
    desc
) {
    return `
            <div class="p-4 rounded-xl border ${cardClass} flex flex-col">

                <div class="flex items-center gap-2 mb-3">

                    <span class="px-2 py-1 rounded text-xs font-bold font-mono ${badgeClass}">
                        ${method}
                    </span>

                </div>

                <code class="text-xs text-gray-600 font-mono mb-2 block truncate">
                    ${endpoint}
                </code>

                <p class="text-xs text-gray-700 leading-relaxed mt-auto">
                    ${desc}
                </p>

            </div>
        `;
}

// =========================================================
// LISTA DE CANDIDATOS
// =========================================================

function renderCandidatos() {
    const content = document.getElementById('app-content');

    let filtered = state.funcionarios;

    // Busca
    if (state.searchQuery) {
        const q = state.searchQuery.toLowerCase();

        filtered = filtered.filter(f =>
            (f.nome || '').toLowerCase().includes(q) ||
            (f.cargo || '').toLowerCase().includes(q) ||
            (f.departamento || '').toLowerCase().includes(q)
        );
    }

    // Filtro status
    if (state.filterStatus !== 'ALL') {
        filtered = filtered.filter(
            f => f.status === state.filterStatus
        );
    }

    const html = `
            <!-- Toolbar -->
            <div class="bg-white p-4 rounded-2xl shadow-soft border border-gray-100 mb-6 flex flex-col sm:flex-row gap-4 justify-between items-center z-10 relative">

                <div class="flex w-full sm:w-auto gap-2">

                    <div class="relative flex-1 sm:w-64">

                        <i
                            data-lucide="search"
                            class="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-ui-graymed"
                        ></i>

                        <input
                            type="text"
                            id="search-input"
                            value="${state.searchQuery}"
                            placeholder="Buscar nome, cargo..."
                            class="w-full bg-ui-offwhite border border-transparent rounded-xl py-2 pl-9 pr-4 text-sm focus:outline-none focus:bg-white focus:border-pp-main transition-all"
                        >

                    </div>

                    <select
                        id="filter-status"
                        class="bg-ui-offwhite border border-transparent rounded-xl py-2 px-4 text-sm text-ui-graydark focus:outline-none focus:bg-white focus:border-pp-main outline-none"
                    >

                        <option
                            value="ALL"
                            ${state.filterStatus === 'ALL' ? 'selected' : ''}
                        >
                            Todos os Status
                        </option>

                        <option
                            value="EM_ANALISE"
                            ${state.filterStatus === 'EM_ANALISE' ? 'selected' : ''}
                        >
                            Em Análise
                        </option>

                        <option
                            value="APROVADO"
                            ${state.filterStatus === 'APROVADO' ? 'selected' : ''}
                        >
                            Aprovado
                        </option>

                        <option
                            value="REPROVADO"
                            ${state.filterStatus === 'REPROVADO' ? 'selected' : ''}
                        >
                            Reprovado
                        </option>

                        <option
                            value="CONTRATADO"
                            ${state.filterStatus === 'CONTRATADO' ? 'selected' : ''}
                        >
                            Contratado
                        </option>

                    </select>

                </div>

                <button
                    onclick="openModal('modal-form', 'post')"
                    class="w-full sm:w-auto px-5 py-2.5 bg-pp-main hover:bg-pp-dark text-white rounded-xl font-medium transition-colors shadow-sm shadow-pp-main/30 flex justify-center items-center gap-2 whitespace-nowrap"
                >

                    <i data-lucide="plus" class="w-4 h-4"></i>

                    Novo Candidato

                </button>

            </div>

            <!-- Table -->
            <div class="bg-white rounded-2xl shadow-soft border border-gray-100 overflow-hidden">

                ${filtered.length === 0
            ? `
                            <div class="p-12 text-center flex flex-col items-center">

                                <div class="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 mb-4">

                                    <i
                                        data-lucide="inbox"
                                        class="w-8 h-8"
                                    ></i>

                                </div>

                                <h3 class="text-lg font-bold text-ui-black mb-1">
                                    Nenhum resultado
                                </h3>

                                <p class="text-ui-graydark text-sm">
                                    Tente ajustar seus filtros ou busca.
                                </p>

                                <button
                                    onclick="clearFilters()"
                                    class="mt-4 text-sm text-pp-main font-medium hover:underline"
                                >
                                    Limpar filtros
                                </button>

                            </div>
                        `
            : `
                            <div class="overflow-x-auto">

                                <table class="w-full text-left border-collapse">

                                    <thead class="bg-gray-50 text-ui-graydark text-xs uppercase font-semibold border-b border-gray-100 responsive-hidden">

                                        <tr>

                                            <th class="px-6 py-4">
                                                Candidato
                                            </th>

                                            <th class="px-6 py-4">
                                                Cargo / Dept
                                            </th>

                                            <th class="px-6 py-4">
                                                Status
                                            </th>

                                            <th class="px-6 py-4">
                                                Salário
                                            </th>

                                            <th class="px-6 py-4 text-center">
                                                Ações
                                            </th>

                                        </tr>

                                    </thead>

                                    <tbody class="divide-y divide-gray-100">

                                        ${filtered.map(f => {

                const statusCfg =
                    getStatusConfig(f.status);

                return `
                                                <tr class="hover:bg-gray-50/50 transition-colors table-row-responsive group">

                                                    <td
                                                        class="px-6 py-4 table-cell-responsive"
                                                        data-label="Candidato"
                                                    >

                                                        <div class="flex items-center gap-3">

                                                            <div class="w-10 h-10 rounded-full bg-ui-offwhite text-ui-graydark flex items-center justify-center font-bold text-sm shrink-0 border border-gray-200">

                                                                ${getInitials(f.nome)}

                                                            </div>

                                                            <div>

                                                                <p class="text-sm font-bold text-ui-black">
                                                                    ${f.nome || '-'}
                                                                </p>

                                                                <p class="text-xs text-ui-graymed">
                                                                    ${f.email || '-'}
                                                                </p>

                                                            </div>

                                                        </div>

                                                    </td>

                                                    <td
                                                        class="px-6 py-4 table-cell-responsive"
                                                        data-label="Cargo"
                                                    >

                                                        <div>

                                                            <p class="text-sm text-ui-black font-medium">
                                                                ${f.cargo || '-'}
                                                            </p>

                                                            <p class="text-xs text-ui-graymed">
                                                                ${f.departamento || '-'}
                                                            </p>

                                                        </div>

                                                    </td>

                                                    <td
                                                        class="px-6 py-4 table-cell-responsive"
                                                        data-label="Status"
                                                    >

                                                        <span class="badge ${statusCfg.class}">

                                                            <i
                                                                data-lucide="${statusCfg.icon}"
                                                                class="w-3 h-3"
                                                            ></i>

                                                            ${statusCfg.label}

                                                        </span>

                                                    </td>

                                                    <td
                                                        class="px-6 py-4 text-sm font-medium text-ui-graydark table-cell-responsive"
                                                        data-label="Salário"
                                                    >

                                                        ${formatCurrency(f.salario)}

                                                    </td>

                                                    <td
                                                        class="px-6 py-4 table-cell-responsive"
                                                        data-label="Ações"
                                                    >

                                                        <div class="flex items-center justify-end md:justify-center gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">

                                                            <button
                                                                onclick="viewFuncionario(${f.id})"
                                                                class="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors tooltip-btn"
                                                                title="Visualizar (GET)"
                                                            >

                                                                <i
                                                                    data-lucide="eye"
                                                                    class="w-4 h-4"
                                                                ></i>

                                                            </button>

                                                            <button
                                                                onclick="openModal('modal-form', 'put', ${f.id})"
                                                                class="p-2 text-ui-graydark hover:text-ui-black hover:bg-gray-100 rounded-lg transition-colors tooltip-btn"
                                                                title="Editar Completo (PUT)"
                                                            >

                                                                <i
                                                                    data-lucide="pencil"
                                                                    class="w-4 h-4"
                                                                ></i>

                                                            </button>

                                                            <button
                                                                onclick="openModal('modal-patch', 'patch', ${f.id})"
                                                                class="p-2 text-pp-dark hover:bg-pp-mint rounded-lg transition-colors tooltip-btn"
                                                                title="Atualização Rápida (PATCH)"
                                                            >

                                                                <i
                                                                    data-lucide="zap"
                                                                    class="w-4 h-4"
                                                                ></i>

                                                            </button>

                                                            <button
                                                                onclick="openModal('modal-delete', 'delete', ${f.id})"
                                                                class="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors tooltip-btn"
                                                                title="Excluir (DELETE)"
                                                            >

                                                                <i
                                                                    data-lucide="trash-2"
                                                                    class="w-4 h-4"
                                                                ></i>

                                                            </button>

                                                        </div>

                                                    </td>

                                                </tr>
                                            `;
            }).join('')}

                                    </tbody>

                                </table>

                            </div>
                        `
        }

            </div>

            <!-- Footer -->
            <div class="mt-6 flex items-center justify-center gap-2 text-xs text-ui-graymed">

                <i data-lucide="info" class="w-4 h-4"></i>

                <span>
                    Passe o mouse sobre a linha para ver as ações
                    (GET, PUT, PATCH, DELETE).
                </span>

            </div>
        `;

    content.innerHTML = html;

    // Busca
    const searchInput =
        document.getElementById('search-input');

    if (searchInput) {
        searchInput.addEventListener('input', (e) => {

            state.searchQuery =
                e.target.value;

            renderCandidatos();
        });
    }

    // Filtro
    const filterSelect =
        document.getElementById('filter-status');

    if (filterSelect) {
        filterSelect.addEventListener('change', (e) => {

            state.filterStatus =
                e.target.value;

            renderCandidatos();
        });
    }

    lucide.createIcons({
        root: content
    });
}

// =========================================================
// LIMPAR FILTROS
// =========================================================

function clearFilters() {
    state.searchQuery = '';
    state.filterStatus = 'ALL';

    renderCandidatos();
}

// =========================================================
// MODAIS
// =========================================================

let currentActionId = null;

function openModal(
    modalId,
    actionType = null,
    id = null
) {
    const modal =
        document.getElementById(modalId);

    modal.classList.remove('hidden');

    currentActionId = id;

    // -----------------------------------------------------
    // FORMULÁRIO POST / PUT
    // -----------------------------------------------------

    if (modalId === 'modal-form') {

        const form =
            document.getElementById('funcionario-form');

        const title =
            document.getElementById('modal-form-title');

        const badge =
            document.getElementById('modal-form-method-badge');

        form.reset();

        // POST
        if (actionType === 'post') {

            title.innerText =
                'Cadastrar Novo Candidato';

            badge.innerHTML =
                '<span class="font-bold text-pp-main">POST</span> /funcionarios';

            document.getElementById('form-id').value = '';

        }

        // PUT
        else if (
            actionType === 'put' &&
            id
        ) {

            title.innerText =
                'Editar Registro Completo';

            badge.innerHTML =
                `<span class="font-bold text-yellow-500">PUT</span> /funcionarios/${id}`;

            const func =
                state.funcionarios.find(
                    f => Number(f.id) === Number(id)
                );

            if (func) {

                document.getElementById('form-id').value =
                    func.id ?? '';

                document.getElementById('form-nome').value =
                    func.nome ?? '';

                document.getElementById('form-email').value =
                    func.email ?? '';

                document.getElementById('form-telefone').value =
                    func.telefone ?? '';

                document.getElementById('form-cidade').value =
                    func.cidade ?? '';

                document.getElementById('form-cargo').value =
                    func.cargo ?? '';

                document.getElementById('form-departamento').value =
                    func.departamento ?? '';

                document.getElementById('form-salario').value =
                    func.salario ?? 0;

                document.getElementById('form-status').value =
                    func.status ?? 'EM_ANALISE';
            }
        }
    }

    // -----------------------------------------------------
    // PATCH
    // -----------------------------------------------------

    if (
        modalId === 'modal-patch' &&
        id
    ) {

        document.getElementById(
            'patch-id-display'
        ).innerText = id;

        const func =
            state.funcionarios.find(
                f => Number(f.id) === Number(id)
            );

        if (func) {

            document.getElementById('patch-id').value =
                func.id;

            document.getElementById('patch-status').value =
                func.status ?? 'EM_ANALISE';

            document.getElementById('patch-salario').value =
                func.salario ?? 0;
        }
    }

    // -----------------------------------------------------
    // DELETE
    // -----------------------------------------------------

    if (
        modalId === 'modal-delete' &&
        id
    ) {

        document.getElementById(
            'delete-id-display'
        ).innerText = id;

        document.getElementById(
            'delete-id'
        ).value = id;
    }
}

function closeModal(modalId) {

    document
        .getElementById(modalId)
        .classList.add('hidden');

    currentActionId = null;
}

// =========================================================
// POST / PUT
// =========================================================

async function submitForm() {

    const form =
        document.getElementById(
            'funcionario-form'
        );

    if (!form.checkValidity()) {

        form.reportValidity();

        return;
    }

    const idField =
        document.getElementById(
            'form-id'
        ).value;

    const isUpdate =
        !!idField;

    const data = {

        nome:
            document.getElementById(
                'form-nome'
            ).value,

        email:
            document.getElementById(
                'form-email'
            ).value,

        telefone:
            document.getElementById(
                'form-telefone'
            ).value,

        cidade:
            document.getElementById(
                'form-cidade'
            ).value,

        cargo:
            document.getElementById(
                'form-cargo'
            ).value,

        departamento:
            document.getElementById(
                'form-departamento'
            ).value,

        salario:
            Number(
                document.getElementById(
                    'form-salario'
                ).value
            ) || 0,

        status:
            document.getElementById(
                'form-status'
            ).value
    };

    try {

        let response;

        // -------------------------------------------------
        // PUT
        // -------------------------------------------------

        if (isUpdate) {

            response = await fetch(
                `${FUNCIONARIOS_URL}/${idField}`,
                {
                    method: 'PUT',

                    headers: {
                        'Content-Type':
                            'application/json'
                    },

                    body:
                        JSON.stringify(data)
                }
            );

        }

        // -------------------------------------------------
        // POST
        // -------------------------------------------------

        else {

            response = await fetch(
                FUNCIONARIOS_URL,
                {
                    method: 'POST',

                    headers: {
                        'Content-Type':
                            'application/json'
                    },

                    body:
                        JSON.stringify(data)
                }
            );
        }

        if (!response.ok) {

            let errorMessage =
                `Erro HTTP ${response.status}`;

            try {

                const errorData =
                    await response.json();

                if (errorData?.message) {
                    errorMessage =
                        errorData.message;
                }

            } catch (_) {
                // resposta sem JSON
            }

            throw new Error(errorMessage);
        }

        // Mensagem
        if (isUpdate) {

            showToast(
                `Dados de ${data.nome} atualizados com sucesso.`
            );

            logActivity(
                `Registro de ${data.nome} atualizado por completo.`
            );

        } else {

            showToast(
                `Candidato ${data.nome} cadastrado com sucesso.`
            );

            logActivity(
                `Novo candidato cadastrado: ${data.nome}.`
            );
        }

        closeModal('modal-form');

        // Recarrega dados da API
        await carregarFuncionarios();

    } catch (error) {

        console.error(
            'Erro no POST/PUT:',
            error
        );

        showToast(
            error.message ||
            'Erro ao salvar funcionário.',
            'error'
        );
    }
}

// =========================================================
// PATCH
// =========================================================

async function submitPatch() {

    const id =
        document.getElementById(
            'patch-id'
        ).value;

    const novoStatus =
        document.getElementById(
            'patch-status'
        ).value;

    const novoSalario =
        Number(
            document.getElementById(
                'patch-salario'
            ).value
        );

    const data = {
        status: novoStatus,
        salario: novoSalario
    };

    try {

        const response =
            await fetch(
                `${FUNCIONARIOS_URL}/${id}`,
                {
                    method: 'PATCH',

                    headers: {
                        'Content-Type':
                            'application/json'
                    },

                    body:
                        JSON.stringify(data)
                }
            );

        if (!response.ok) {
            throw new Error(
                `Erro HTTP ${response.status}`
            );
        }

        const func =
            state.funcionarios.find(
                f => Number(f.id) === Number(id)
            );

        showToast(
            'Atualização parcial aplicada com sucesso.'
        );

        if (func) {

            logActivity(
                `Status/Salário de ${func.nome} atualizado rapidamente.`
            );
        }

        closeModal('modal-patch');

        if (
            !document
                .getElementById('modal-view')
                .classList
                .contains('hidden')
        ) {
            closeModal('modal-view');
        }

        await carregarFuncionarios();

    } catch (error) {

        console.error(
            'Erro no PATCH:',
            error
        );

        showToast(
            'Erro ao atualizar funcionário.',
            'error'
        );
    }
}

// =========================================================
// DELETE
// =========================================================

async function confirmDelete() {

    const id =
        document.getElementById(
            'delete-id'
        ).value;

    const func =
        state.funcionarios.find(
            f => Number(f.id) === Number(id)
        );

    try {

        const response =
            await fetch(
                `${FUNCIONARIOS_URL}/${id}`,
                {
                    method: 'DELETE'
                }
            );

        if (!response.ok) {
            throw new Error(
                `Erro HTTP ${response.status}`
            );
        }

        showToast(
            'Candidato excluído com sucesso.'
        );

        if (func) {

            logActivity(
                `Candidato #${id} (${func.nome}) foi removido.`,
                'warning'
            );
        }

        closeModal('modal-delete');

        await carregarFuncionarios();

    } catch (error) {

        console.error(
            'Erro no DELETE:',
            error
        );

        showToast(
            'Erro ao excluir funcionário.',
            'error'
        );
    }
}

// =========================================================
// GET POR ID
// =========================================================

async function viewFuncionario(id) {

    try {

        const response =
            await fetch(
                `${FUNCIONARIOS_URL}/${id}`
            );

        if (!response.ok) {
            throw new Error(
                `Erro HTTP ${response.status}`
            );
        }

        const func =
            await response.json();

        document.getElementById(
            'view-avatar'
        ).innerText =
            getInitials(func.nome);

        document.getElementById(
            'view-nome'
        ).innerText =
            func.nome || '-';

        document.getElementById(
            'view-cargo'
        ).innerText =
            func.cargo || '-';

        document.getElementById(
            'view-departamento'
        ).innerText =
            func.departamento || '-';

        document.getElementById(
            'view-email'
        ).innerText =
            func.email || '-';

        document.getElementById(
            'view-telefone'
        ).innerText =
            func.telefone || '-';

        document.getElementById(
            'view-cidade'
        ).innerText =
            func.cidade || '-';

        document.getElementById(
            'view-salario'
        ).innerText =
            formatCurrency(func.salario);

        const statusCfg =
            getStatusConfig(func.status);

        document.getElementById(
            'view-status-badge'
        ).innerHTML = `
                <span class="badge ${statusCfg.class} shadow-sm border border-white/50">

                    <i
                        data-lucide="${statusCfg.icon}"
                        class="w-4 h-4"
                    ></i>

                    ${statusCfg.label}

                </span>
            `;

        // Botão editar
        document.getElementById(
            'btn-edit-from-view'
        ).onclick = () => {

            closeModal('modal-view');

            openModal(
                'modal-form',
                'put',
                func.id
            );
        };

        // Botão patch
        document.getElementById(
            'btn-patch-from-view'
        ).onclick = () => {

            closeModal('modal-view');

            openModal(
                'modal-patch',
                'patch',
                func.id
            );
        };

        const modal =
            document.getElementById(
                'modal-view'
            );

        modal.classList.remove('hidden');

        lucide.createIcons({
            root: modal
        });

    } catch (error) {

        console.error(
            'Erro no GET por ID:',
            error
        );

        showToast(
            'Erro ao buscar funcionário.',
            'error'
        );
    }
}

// =========================================================
// RELATÓRIOS
// =========================================================

function renderRelatorios() {

    const content =
        document.getElementById(
            'app-content'
        );

    content.innerHTML = `

            <div class="bg-white p-8 rounded-2xl shadow-soft border border-gray-100 max-w-4xl mx-auto text-center mt-10">

                <div class="w-24 h-24 bg-pp-mint text-pp-dark rounded-full flex items-center justify-center mx-auto mb-6">

                    <i
                        data-lucide="bar-chart-2"
                        class="w-12 h-12"
                    ></i>

                </div>

                <h2 class="text-2xl font-bold text-ui-black mb-2">
                    Relatórios Gerenciais
                </h2>

                <p class="text-ui-graydark mb-8">
                    Esta área é um placeholder para demonstração.
                    Em um sistema real, aqui seriam exibidos
                    gráficos avançados e exportação de dados.
                </p>

                <div class="grid grid-cols-2 gap-4 text-left">

                    <div class="p-4 bg-ui-offwhite rounded-xl">

                        <p class="text-sm text-ui-graymed">
                            Taxa de Conversão
                        </p>

                        <p class="text-xl font-bold text-ui-black">
                            32%
                        </p>

                    </div>

                    <div class="p-4 bg-ui-offwhite rounded-xl">

                        <p class="text-sm text-ui-graymed">
                            Tempo Médio (SLA)
                        </p>

                        <p class="text-xl font-bold text-ui-black">
                            14 dias
                        </p>

                    </div>

                </div>

            </div>

        `;

    lucide.createIcons({
        root: content
    });
}

// =========================================================
// CONFIGURAÇÕES
// =========================================================

function renderConfiguracoes() {

    const content =
        document.getElementById(
            'app-content'
        );

    content.innerHTML = `

            <div class="bg-white p-8 rounded-2xl shadow-soft border border-gray-100 max-w-2xl">

                <h2 class="text-xl font-bold text-ui-black mb-6">
                    Configurações do Perfil
                </h2>

                <form
                    onsubmit="event.preventDefault(); showToast('Configurações salvas (mock).')"
                    class="space-y-6"
                >

                    <div class="flex items-center gap-6 mb-6">

                        <div class="w-20 h-20 rounded-full bg-pp-light text-pp-dark flex items-center justify-center font-bold text-2xl shadow-sm">
                            AR
                        </div>

                        <div>

                            <button
                                type="button"
                                class="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50"
                            >
                                Alterar Foto
                            </button>

                        </div>

                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-5">

                        <div class="space-y-1">

                            <label class="text-sm font-medium text-ui-graydark">
                                Nome
                            </label>

                            <input
                                type="text"
                                value="Admin RH"
                                class="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-pp-main outline-none"
                            >

                        </div>

                        <div class="space-y-1">

                            <label class="text-sm font-medium text-ui-graydark">
                                E-mail
                            </label>

                            <input
                                type="email"
                                value="admin@picpay.com"
                                class="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-pp-main outline-none"
                            >

                        </div>

                    </div>

                    <div class="space-y-3 pt-4 border-t border-gray-100">

                        <h3 class="text-sm font-bold text-ui-black">
                            Preferências
                        </h3>

                        <label class="flex items-center gap-3 cursor-pointer">

                            <input
                                type="checkbox"
                                checked
                                class="w-4 h-4 text-pp-main rounded border-gray-300 focus:ring-pp-main"
                            >

                            <span class="text-sm text-ui-graydark">
                                Receber notificações por e-mail
                            </span>

                        </label>

                        <label class="flex items-center gap-3 cursor-pointer">

                            <input
                                type="checkbox"
                                checked
                                class="w-4 h-4 text-pp-main rounded border-gray-300 focus:ring-pp-main"
                            >

                            <span class="text-sm text-ui-graydark">
                                Ativar modo escuro (Em breve)
                            </span>

                        </label>

                    </div>

                    <div class="pt-6 flex justify-end">

                        <button
                            type="submit"
                            class="px-6 py-2.5 bg-pp-main hover:bg-pp-dark text-white rounded-xl font-medium transition-colors shadow-sm shadow-pp-main/30"
                        >
                            Salvar Alterações
                        </button>

                    </div>

                </form>

            </div>

        `;

    lucide.createIcons({
        root: content
    });
}

// =========================================================
// INICIALIZAÇÃO
// =========================================================

document.addEventListener(
    'DOMContentLoaded',
    async () => {

        // ---------------------------------------------
        // Sidebar Mobile
        // ---------------------------------------------

        const sidebar =
            document.getElementById(
                'sidebar'
            );

        document
            .getElementById('open-sidebar')
            .addEventListener(
                'click',
                () => {

                    sidebar.classList.remove(
                        '-translate-x-full'
                    );

                    sidebar.classList.add(
                        'translate-x-0',
                        'shadow-2xl'
                    );
                }
            );

        document
            .getElementById('close-sidebar')
            .addEventListener(
                'click',
                () => {

                    sidebar.classList.add(
                        '-translate-x-full'
                    );

                    sidebar.classList.remove(
                        'translate-x-0',
                        'shadow-2xl'
                    );
                }
            );

        // ---------------------------------------------
        // Lucide
        // ---------------------------------------------

        lucide.createIcons();

        // ---------------------------------------------
        // Busca dados da API
        // ---------------------------------------------

        await carregarFuncionarios();

        // ---------------------------------------------
        // Tela inicial
        // ---------------------------------------------

        navigate('dashboard');
    }
);