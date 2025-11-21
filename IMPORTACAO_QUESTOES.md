# Guia de Importação de Questões com Imagens

## Formato JSON

As questões devem ser importadas em formato JSON como um array de objetos. Cada questão pode conter imagens opcionais.

## Estrutura Básica

```json
[
  {
    "statement": "Enunciado da questão",
    "subject_id": "id_da_materia",
    "content_id": "id_do_conteudo",
    "topic_id": "id_do_topico",
    "exam_id": "enem",
    "year": 2024,
    "difficulty": "facil",
    "option_a": "Alternativa A",
    "option_b": "Alternativa B",
    "option_c": "Alternativa C",
    "option_d": "Alternativa D",
    "option_e": "Alternativa E",
    "correct_answer": "A",
    "explanation": "Explicação da resposta",
    "question_type": "multipla_escolha",
    "images": [
      {
        "url": "https://exemplo.com/imagem.png",
        "display_order": 0
      }
    ]
  }
]
```

## Campos Obrigatórios

- `statement`: Texto do enunciado da questão
- `subject_id`: ID da matéria (ex: "matematica", "portugues")
- `content_id`: ID do conteúdo (ex: "algebra", "geometria")
- `exam_id`: ID do vestibular ("enem" ou "paes_uema")
- `year`: Ano da questão (número inteiro)

## Campos Opcionais

- `topic_id`: ID do tópico específico
- `difficulty`: "facil", "medio" ou "dificil"
- `option_a`, `option_b`, `option_c`, `option_d`, `option_e`: Alternativas (para questões de múltipla escolha)
- `correct_answer`: Letra da alternativa correta ("A", "B", "C", "D" ou "E")
- `explanation`: Explicação/resolução da questão
- `question_type`: "multipla_escolha", "discursiva" ou "verdadeiro_falso"
- `images`: Array de imagens da questão

## Adicionando Imagens

### Opção 1: URL Direta

Se a imagem já está hospedada em algum servidor, use a URL direta:

```json
"images": [
  {
    "url": "https://exemplo.com/imagem1.png",
    "display_order": 0
  },
  {
    "url": "https://exemplo.com/imagem2.jpg",
    "display_order": 1
  }
]
```

### Opção 2: Base64

Para incluir a imagem diretamente no JSON (útil para imagens pequenas):

```json
"images": [
  {
    "url": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
    "display_order": 0
  }
]
```

**Como converter uma imagem para Base64:**

1. **Online**: Use sites como https://www.base64-image.de/
2. **Node.js**:
```javascript
const fs = require('fs');
const imageBuffer = fs.readFileSync('imagem.png');
const base64 = imageBuffer.toString('base64');
const dataUrl = `data:image/png;base64,${base64}`;
```

3. **Python**:
```python
import base64

with open('imagem.png', 'rb') as image_file:
    encoded = base64.b64encode(image_file.read()).decode()
    data_url = f'data:image/png;base64,{encoded}'
```

## Campo `display_order`

O campo `display_order` determina a ordem de exibição das imagens (0 = primeira imagem, 1 = segunda, etc.). Se não especificado, será usado 0.

## Exemplo Completo com Imagens

```json
[
  {
    "statement": "Observe o gráfico abaixo e responda: qual é o valor de x quando y = 5?",
    "subject_id": "matematica",
    "content_id": "funcoes",
    "topic_id": "funcao_primeiro_grau",
    "exam_id": "enem",
    "year": 2024,
    "difficulty": "medio",
    "option_a": "x = 2",
    "option_b": "x = 3",
    "option_c": "x = 4",
    "option_d": "x = 5",
    "option_e": "x = 6",
    "correct_answer": "B",
    "explanation": "Através da análise do gráfico, quando y = 5, o valor correspondente de x é 3.",
    "question_type": "multipla_escolha",
    "images": [
      {
        "url": "https://exemplo.com/grafico-funcao.png",
        "display_order": 0
      }
    ]
  }
]
```

## Dicas Importantes

1. **Tamanho das Imagens**: Imagens em Base64 aumentam muito o tamanho do arquivo JSON. Prefira URLs para imagens grandes.

2. **Formatos Suportados**: PNG, JPG, JPEG, GIF, WebP

3. **Múltiplas Imagens**: Uma questão pode ter várias imagens. Use `display_order` para controlar a ordem.

4. **Validação**: Sempre valide seu JSON antes de importar usando ferramentas como https://jsonlint.com/

5. **Teste Primeiro**: Faça um teste com 1-2 questões antes de importar um arquivo grande.

## Obtendo IDs Válidos

Para descobrir os IDs válidos de matérias, conteúdos e tópicos:

1. Acesse o **Relatório de Taxonomia** no menu admin
2. Ou consulte diretamente no banco de dados Supabase

### Exames Disponíveis
- `enem`: ENEM
- `paes_uema`: PAES UEMA

## Importando o Arquivo

1. No sistema, clique em **"Banco de Questões"**
2. Clique no botão **"Importar JSON"**
3. Clique em **"Baixar Template"** para ver um exemplo
4. Faça upload do seu arquivo JSON ou cole o conteúdo
5. Clique em **"Importar Questões"**

O sistema processará as questões e fará upload automático das imagens.
