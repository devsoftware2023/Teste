document.addEventListener("DOMContentLoaded", function () {
    
    //Inicializando o select das tags
    $('#tags').select2({
        placeholder: "Selecione as tags",
        allowClear: true
    });
    
    
    const formOrientacao = document.getElementById("form-orientacao");
    const listaOrientacoes = document.getElementById("lista-orientacoes");
    const tipoCancerSelect = document.getElementById("tipo_cancer");
    const categoriaSelect = document.getElementById("categoria");
    const pesquisaTagInput = document.getElementById("pesquisa-tag");
    const botaoPesquisar = document.getElementById("botao-pesquisar");
    
    let orientacoes = [];
    
    formOrientacao.addEventListener("submit", async function (event) {
        event.preventDefault();
        
        const titulo = document.getElementById("titulo").value;
        const conteudo = document.getElementById("conteudo").value;
        const tipoCancer = document.getElementById("tipo_cancer").value;
        const categoria = document.getElementById("categoria").value;
        
        const selectedTags = $('#tags').val();
        const anexos = document.getElementById("anexo").files;
        
        const orientacao = {
            titulo,
            descricao: conteudo,
            tipo_cancer: tipoCancer,
            categoria,
            selectedTags,
            anexos: [...anexos].map(file => file.name),
        };
        
        // orientacoes.push(orientacao);
        console.log(orientacao)
        await postOrientacao(orientacao);
        // atualizarListaOrientacoes();
        
        formOrientacao.reset();
        tipoCancerSelect.value = "";
        categoriaSelect.value = "";
    });
    
    function atualizarListaOrientacoes() {
        const tagPesquisa = pesquisaTagInput.value.trim().toLowerCase();
        listaOrientacoes.innerHTML = "";
        
        orientacoes
        .filter(orientacao => {
            if (tagPesquisa === "") return true;
            return orientacao.tags.some(tag => tag.toLowerCase().includes(tagPesquisa));
        })
        .forEach(orientacao => {
            const item = document.createElement("div");
            item.className = "list-group-item";
            
            const titulo = document.createElement("h5");
            titulo.textContent = orientacao.titulo;
            
            const conteudo = document.createElement("p");
            conteudo.textContent = orientacao.conteudo;
            
            const tipoCancer = document.createElement("p");
            tipoCancer.textContent = `Tipologia do Câncer: ${orientacao.tipoCancer}`;
            
            const categoria = document.createElement("p");
            categoria.textContent = `Categoria: ${orientacao.categoria}`;
            
            const tags = document.createElement("p");
            tags.textContent = `Tags: ${orientacao.tags.join(", ")}`;
            
            const anexos = document.createElement("ul");
            anexos.textContent = "Anexos:";
            orientacao.anexos.forEach(anexo => {
                const li = document.createElement("li");
                li.textContent = anexo;
                anexos.appendChild(li);
            });
            
            const editarBtn = document.createElement("button");
            editarBtn.className = "btn btn-warning btn-sm";
            editarBtn.textContent = "Editar";
            editarBtn.addEventListener("click", function () {
                editarOrientacao(orientacao.id);
            });
            
            const excluirBtn = document.createElement("button");
            excluirBtn.className = "btn btn-danger btn-sm ml-2";
            excluirBtn.textContent = "Excluir";
            excluirBtn.addEventListener("click", function () {
                excluirOrientacao(orientacao.id);
            });
            
            item.appendChild(titulo);
            item.appendChild(conteudo);
            item.appendChild(tipoCancer);
            item.appendChild(categoria);
            item.appendChild(tags);
            item.appendChild(anexos);
            item.appendChild(editarBtn);
            item.appendChild(excluirBtn);
            
            listaOrientacoes.appendChild(item);
        });
    }
    
    // Função assíncrona para mandar os dados para a api    
    async function postOrientacao(obj) {
        try {
            const response = await fetch("http://localhost:3000/api/orientacoes", {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(obj)
            })
            
            // Exibe o status da resposta
            console.log(response.status);
            
            const data = await response.json();
            console.log(data)
        } catch (error) {
            console.error(error)
        }
    }
    
    function editarOrientacao(id) {
        const orientacao = orientacoes.find(o => o.id === id);
        
        document.getElementById("titulo").value = orientacao.titulo;
        document.getElementById("conteudo").value = orientacao.conteudo;
        document.getElementById("tipo_cancer").value = orientacao.tipoCancer;
        document.getElementById("categoria").value = orientacao.categoria;
        document.getElementById("tags").value = orientacao.tags.join(",");
        
        excluirOrientacao(id);
    }
    
    function excluirOrientacao(id) {
        orientacoes = orientacoes.filter(o => o.id !== id);
        atualizarListaOrientacoes();
    }
    
    document.getElementById("adicionar-tipologia").addEventListener("click", function () {
        const novaTipologia = document.getElementById("nova-tipologia").value.trim();
        if (novaTipologia && !Array.from(tipoCancerSelect.options).some(option => option.value === novaTipologia)) {
            const option = document.createElement("option");
            option.value = novaTipologia;
            option.textContent = novaTipologia;
            tipoCancerSelect.appendChild(option);
            document.getElementById("nova-tipologia").value = "";
        }
    });
    
    document.getElementById("adicionar-categoria").addEventListener("click", function () {
        const novaCategoria = document.getElementById("nova-categoria").value.trim();
        if (novaCategoria && !Array.from(categoriaSelect.options).some(option => option.value === novaCategoria)) {
            const option = document.createElement("option");
            option.value = novaCategoria;
            option.textContent = novaCategoria;
            categoriaSelect.appendChild(option);
            document.getElementById("nova-categoria").value = "";
        }
    });
    
    botaoPesquisar.addEventListener("click", atualizarListaOrientacoes);
});
