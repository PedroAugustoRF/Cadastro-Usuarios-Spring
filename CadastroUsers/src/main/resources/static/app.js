// Mesma origem do Spring Boot (porta 3000), então basta a URL relativa.
const API = '/users';

document.addEventListener('alpine:init', () => {
  Alpine.data('usuarios', () => ({
    lista: [],
    busca: '',
    carregando: true,
    salvando: false,
    erro: '',
    erros: {},
    form: { id: null, nome: '', idade: '' },
    aExcluir: null,
    toast: { msg: '', tipo: '' },
    _timer: null,

    // ---------- Ciclo de vida ----------
    init() {
      this.carregar();
    },

    // ---------- Derivados ----------
    get editando() {
      return this.form.id !== null;
    },

    get filtrada() {
      const q = this.busca.trim().toLowerCase();
      if (!q) return this.lista;
      return this.lista.filter(u => (u.nome ?? '').toLowerCase().includes(q));
    },

    get resumo() {
      const n = this.lista.length;
      return n === 1 ? '1 usuário cadastrado' : `${n} usuários cadastrados`;
    },

    // ---------- Apresentação ----------
    iniciais(u) {
      const partes = (u.nome ?? '').trim().split(/\s+/).filter(Boolean);
      if (partes.length === 0) return '?';
      const primeira = partes[0][0];
      const ultima = partes.length > 1 ? partes[partes.length - 1][0] : '';
      return (primeira + ultima).toUpperCase();
    },

    // Cor do avatar derivada do id: sempre a mesma para o mesmo usuário
    matiz(u) {
      return ((u.id ?? 0) * 47) % 360;
    },

    // ---------- API ----------
    async api(url, opcoes = {}) {
      const res = await fetch(url, {
        headers: { 'Content-Type': 'application/json' },
        ...opcoes,
      });
      if (!res.ok) throw new Error(`A API respondeu com erro ${res.status}.`);
      const texto = await res.text();
      return texto ? JSON.parse(texto) : null;
    },

    async carregar() {
      this.carregando = true;
      this.erro = '';
      try {
        const dados = await this.api(API);
        this.lista = (dados ?? []).sort((a, b) => b.id - a.id); // mais recentes primeiro
      } catch (e) {
        this.erro = e instanceof TypeError
          ? 'Sem conexão com a API. Confira se o Spring Boot está rodando na porta 3000.'
          : e.message;
      } finally {
        this.carregando = false;
      }
    },

    // ---------- Formulário ----------
    validar() {
      const erros = {};
      const nome = this.form.nome.trim();
      const idade = this.form.idade;

      if (!nome) erros.nome = 'Informe o nome.';

      if (idade === '' || idade === null) {
        erros.idade = 'Informe a idade.';
      } else if (!Number.isInteger(Number(idade)) || Number(idade) < 0 || Number(idade) > 150) {
        erros.idade = 'Use um número inteiro entre 0 e 150.';
      }

      this.erros = erros;
      return Object.keys(erros).length === 0;
    },

    async salvar() {
      if (!this.validar()) return;

      this.salvando = true;
      const eraEdicao = this.editando;

      // Se o objeto tem id, o JPA (save) atualiza; sem id, insere.
      const corpo = {
        ...(eraEdicao && { id: this.form.id }),
        nome: this.form.nome.trim(),
        idade: Number(this.form.idade),
      };

      try {
        const salvo = await this.api(API, { method: 'POST', body: JSON.stringify(corpo) });

        if (eraEdicao) {
          this.lista = this.lista.map(u => (u.id === salvo.id ? salvo : u));
        } else {
          this.lista = [salvo, ...this.lista];
        }

        this.avisar(eraEdicao ? 'Alterações salvas' : 'Usuário adicionado');
        this.limparForm();
      } catch (e) {
        this.avisar('Não foi possível salvar. Tente de novo.', 'erro');
      } finally {
        this.salvando = false;
      }
    },

    editar(u) {
      this.form = { id: u.id, nome: u.nome ?? '', idade: u.idade ?? '' };
      this.erros = {};
      this.$refs.nome.focus();
    },

    cancelar() {
      this.limparForm();
    },

    limparForm() {
      this.form = { id: null, nome: '', idade: '' };
      this.erros = {};
    },

    // ---------- Exclusão ----------
    pedirExclusao(u) {
      this.aExcluir = u;
      this.$refs.dialogo.showModal();
    },

    async excluir() {
      const u = this.aExcluir;
      if (!u) return;

      this.salvando = true;
      try {
        await this.api(`${API}/${u.id}`, { method: 'DELETE' });
        this.lista = this.lista.filter(x => x.id !== u.id);
        if (this.form.id === u.id) this.limparForm();
        this.$refs.dialogo.close();
        this.avisar('Usuário excluído');
      } catch (e) {
        this.$refs.dialogo.close();
        this.avisar('Não foi possível excluir. Tente de novo.', 'erro');
      } finally {
        this.salvando = false;
      }
    },

    // ---------- Aviso rápido ----------
    avisar(msg, tipo = '') {
      clearTimeout(this._timer);
      this.toast = { msg, tipo };
      this._timer = setTimeout(() => (this.toast = { msg: '', tipo: '' }), 3000);
    },
  }));
});
