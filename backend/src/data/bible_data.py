"""
Bible data initialization with sample content
"""

# Bible books data
BIBLE_BOOKS = [
    # Old Testament
    {'name': 'Gênesis', 'abbreviation': 'Gn', 'testament': 'old', 'order': 1, 'chapters_count': 50},
    {'name': 'Êxodo', 'abbreviation': 'Ex', 'testament': 'old', 'order': 2, 'chapters_count': 40},
    {'name': 'Levítico', 'abbreviation': 'Lv', 'testament': 'old', 'order': 3, 'chapters_count': 27},
    {'name': 'Números', 'abbreviation': 'Nm', 'testament': 'old', 'order': 4, 'chapters_count': 36},
    {'name': 'Deuteronômio', 'abbreviation': 'Dt', 'testament': 'old', 'order': 5, 'chapters_count': 34},
    {'name': 'Josué', 'abbreviation': 'Js', 'testament': 'old', 'order': 6, 'chapters_count': 24},
    {'name': 'Juízes', 'abbreviation': 'Jz', 'testament': 'old', 'order': 7, 'chapters_count': 21},
    {'name': 'Rute', 'abbreviation': 'Rt', 'testament': 'old', 'order': 8, 'chapters_count': 4},
    {'name': '1 Samuel', 'abbreviation': '1Sm', 'testament': 'old', 'order': 9, 'chapters_count': 31},
    {'name': '2 Samuel', 'abbreviation': '2Sm', 'testament': 'old', 'order': 10, 'chapters_count': 24},
    {'name': '1 Reis', 'abbreviation': '1Rs', 'testament': 'old', 'order': 11, 'chapters_count': 22},
    {'name': '2 Reis', 'abbreviation': '2Rs', 'testament': 'old', 'order': 12, 'chapters_count': 25},
    {'name': 'Salmos', 'abbreviation': 'Sl', 'testament': 'old', 'order': 19, 'chapters_count': 150},
    {'name': 'Provérbios', 'abbreviation': 'Pv', 'testament': 'old', 'order': 20, 'chapters_count': 31},
    
    # New Testament
    {'name': 'Mateus', 'abbreviation': 'Mt', 'testament': 'new', 'order': 40, 'chapters_count': 28},
    {'name': 'Marcos', 'abbreviation': 'Mc', 'testament': 'new', 'order': 41, 'chapters_count': 16},
    {'name': 'Lucas', 'abbreviation': 'Lc', 'testament': 'new', 'order': 42, 'chapters_count': 24},
    {'name': 'João', 'abbreviation': 'Jo', 'testament': 'new', 'order': 43, 'chapters_count': 21},
    {'name': 'Atos', 'abbreviation': 'At', 'testament': 'new', 'order': 44, 'chapters_count': 28},
    {'name': 'Romanos', 'abbreviation': 'Rm', 'testament': 'new', 'order': 45, 'chapters_count': 16},
    {'name': '1 Coríntios', 'abbreviation': '1Co', 'testament': 'new', 'order': 46, 'chapters_count': 16},
    {'name': '2 Coríntios', 'abbreviation': '2Co', 'testament': 'new', 'order': 47, 'chapters_count': 13},
    {'name': 'Gálatas', 'abbreviation': 'Gl', 'testament': 'new', 'order': 48, 'chapters_count': 6},
    {'name': 'Efésios', 'abbreviation': 'Ef', 'testament': 'new', 'order': 49, 'chapters_count': 6},
]

# Sample verses for Genesis 1
GENESIS_1_VERSES = [
    {'number': 1, 'text': 'No princípio, Deus criou os céus e a terra.'},
    {'number': 2, 'text': 'A terra era sem forma e vazia; havia trevas sobre a face do abismo, e o Espírito de Deus pairava sobre as águas.'},
    {'number': 3, 'text': 'Disse Deus: "Haja luz!" E houve luz.'},
    {'number': 4, 'text': 'Deus viu que a luz era boa. Deus separou a luz das trevas.'},
    {'number': 5, 'text': 'Deus chamou à luz Dia e às trevas chamou Noite. Houve tarde e manhã, o primeiro dia.'},
    {'number': 6, 'text': 'Disse Deus: "Haja um firmamento no meio das águas, e que ele separe águas de águas."'},
    {'number': 7, 'text': 'Então Deus fez o firmamento e separou as águas que ficaram abaixo do firmamento das que ficaram por cima. E assim foi.'},
    {'number': 8, 'text': 'Deus chamou ao firmamento céu. Houve tarde e manhã: foi o segundo dia.'},
    {'number': 9, 'text': 'Disse Deus: "Ajuntem-se as águas debaixo do céu num só lugar, e apareça a terra seca." E assim foi.'},
    {'number': 10, 'text': 'Deus chamou à terra seca Terra, e ao ajuntamento das águas chamou Mares. E viu Deus que era bom.'},
    {'number': 11, 'text': 'E disse Deus: "Produza a terra relva, ervas que deem semente e árvores frutíferas que deem fruto segundo a sua espécie, cuja semente esteja nele, sobre a terra." E assim foi.'},
    {'number': 12, 'text': 'A terra, pois, produziu relva, ervas que davam semente segundo a sua espécie e árvores que davam fruto, cuja semente estava nele, segundo a sua espécie. E viu Deus que era bom.'},
    {'number': 13, 'text': 'Houve tarde e manhã: foi o terceiro dia.'},
    {'number': 14, 'text': 'Disse Deus: "Haja luzeiros no firmamento dos céus para separar o dia da noite; e sejam eles para sinais, para estações, para dias e anos."'},
    {'number': 15, 'text': 'E sejam para luzeiros no firmamento dos céus, para alumiar a terra." E assim foi.'},
    {'number': 16, 'text': 'Fez Deus os dois grandes luzeiros: o maior para governar o dia, e o menor para governar a noite; e fez também as estrelas.'},
    {'number': 17, 'text': 'E os colocou Deus no firmamento dos céus para alumiar a terra,'},
    {'number': 18, 'text': 'para governar o dia e a noite e para separar a luz das trevas. E viu Deus que era bom.'},
    {'number': 19, 'text': 'Houve tarde e manhã: foi o quarto dia.'},
    {'number': 20, 'text': 'Disse Deus: "Povoem-se as águas de enxames de seres viventes, e voem as aves sobre a terra, sob o firmamento dos céus."'},
    {'number': 21, 'text': 'Criou, pois, Deus os grandes animais marinhos e todos os seres viventes que rastejam, os quais povoaram as águas, segundo as suas espécies; e toda ave que voa, segundo a sua espécie. E viu Deus que era bom.'},
    {'number': 22, 'text': 'E Deus os abençoou, dizendo: "Sede fecundos, multiplicai-vos e enchei as águas dos mares; e multipliquem-se as aves sobre a terra."'},
    {'number': 23, 'text': 'Houve tarde e manhã: foi o quinto dia.'},
    {'number': 24, 'text': 'Disse Deus: "Produza a terra seres viventes, segundo as suas espécies: animais domésticos, répteis e animais selváticos, segundo as suas espécies." E assim foi.'},
    {'number': 25, 'text': 'Fez Deus os animais selváticos, segundo as suas espécies, e os animais domésticos, segundo as suas espécies, e todos os répteis da terra, segundo as suas espécies. E viu Deus que era bom.'},
    {'number': 26, 'text': 'Disse Deus: "Façamos o homem à nossa imagem, conforme a nossa semelhança; tenha ele domínio sobre os peixes do mar, sobre as aves dos céus, sobre os animais domésticos, sobre toda a terra e sobre todos os répteis que rastejam pela terra."'},
    {'number': 27, 'text': 'Criou Deus o homem à sua imagem; à imagem de Deus o criou; homem e mulher os criou.'},
    {'number': 28, 'text': 'E Deus os abençoou e lhes disse: "Sede fecundos, multiplicai-vos, enchei a terra e sujeitai-a; dominai sobre os peixes do mar, sobre as aves dos céus e sobre todo animal que rasteja pela terra."'},
    {'number': 29, 'text': 'E disse Deus: "Eis que vos tenho dado todas as ervas que dão semente e se acham na superfície de toda a terra e todas as árvores em que há fruto que dê semente; isso vos será para mantimento."'},
    {'number': 30, 'text': 'E a todos os animais da terra, e a todas as aves dos céus, e a todos os répteis da terra, em que há fôlego de vida, toda erva verde lhes será para mantimento." E assim foi.'},
    {'number': 31, 'text': 'Viu Deus tudo quanto fizera, e eis que era muito bom. Houve tarde e manhã: foi o sexto dia.'}
]

# Sample verses for John 3
JOHN_3_VERSES = [
    {'number': 1, 'text': 'Havia entre os fariseus um homem chamado Nicodemos, um dos principais dos judeus.'},
    {'number': 2, 'text': 'Este foi ter com Jesus, de noite, e disse-lhe: Rabi, sabemos que és Mestre vindo da parte de Deus; porque ninguém pode fazer estes sinais que tu fazes, se Deus não estiver com ele.'},
    {'number': 3, 'text': 'Respondeu-lhe Jesus: Em verdade, em verdade te digo que, se alguém não nascer de novo, não pode ver o reino de Deus.'},
    {'number': 4, 'text': 'Perguntou-lhe Nicodemos: Como pode um homem nascer, sendo velho? Pode, porventura, voltar ao ventre materno e nascer segunda vez?'},
    {'number': 5, 'text': 'Jesus respondeu: Em verdade, em verdade te digo: quem não nascer da água e do Espírito não pode entrar no reino de Deus.'},
    {'number': 6, 'text': 'O que é nascido da carne é carne; e o que é nascido do Espírito é espírito.'},
    {'number': 7, 'text': 'Não te admires de eu te dizer: importa-vos nascer de novo.'},
    {'number': 8, 'text': 'O vento sopra onde quer, ouves a sua voz, mas não sabes donde vem, nem para onde vai; assim é todo o que é nascido do Espírito.'},
    {'number': 9, 'text': 'Replicou-lhe Nicodemos: Como pode suceder isto?'},
    {'number': 10, 'text': 'Acudiu Jesus: Tu és mestre em Israel e não compreendes estas coisas?'},
    {'number': 11, 'text': 'Em verdade, em verdade te digo que nós falamos do que sabemos e testificamos do que temos visto; contudo, não aceitais o nosso testemunho.'},
    {'number': 12, 'text': 'Se, falando-vos de coisas terrenas, não credes, como crereis, se vos falar das celestiais?'},
    {'number': 13, 'text': 'Ora, ninguém subiu ao céu, senão aquele que de lá desceu, a saber, o Filho do Homem que está no céu.'},
    {'number': 14, 'text': 'E do modo por que Moisés levantou a serpente no deserto, assim importa que o Filho do Homem seja levantado,'},
    {'number': 15, 'text': 'para que todo o que nele crê tenha a vida eterna.'},
    {'number': 16, 'text': 'Porque Deus amou ao mundo de tal maneira que deu o seu Filho unigênito, para que todo o que nele crê não pereça, mas tenha a vida eterna.'},
    {'number': 17, 'text': 'Porquanto Deus enviou o seu Filho ao mundo, não para que julgasse o mundo, mas para que o mundo fosse salvo por ele.'},
    {'number': 18, 'text': 'Quem nele crê não é julgado; o que não crê já está julgado, porquanto não crê no nome do unigênito Filho de Deus.'},
    {'number': 19, 'text': 'O julgamento é este: que a luz veio ao mundo, e os homens amaram mais as trevas do que a luz; porque as suas obras eram más.'},
    {'number': 20, 'text': 'Pois todo aquele que pratica o mal aborrece a luz e não se chega para a luz, a fim de não serem arguidas as suas obras.'},
    {'number': 21, 'text': 'Quem pratica a verdade aproxima-se da luz, para que as suas obras sejam manifestas, porque são feitas em Deus.'}
]

# Sample verses for Psalm 23
PSALM_23_VERSES = [
    {'number': 1, 'text': 'O Senhor é o meu pastor; nada me faltará.'},
    {'number': 2, 'text': 'Deitar-me faz em verdes pastos, guia-me mansamente a águas tranquilas.'},
    {'number': 3, 'text': 'Refrigera a minha alma; guia-me pelas veredas da justiça por amor do seu nome.'},
    {'number': 4, 'text': 'Ainda que eu andasse pelo vale da sombra da morte, não temeria mal algum, porque tu estás comigo; a tua vara e o teu cajado me consolam.'},
    {'number': 5, 'text': 'Preparas uma mesa perante mim na presença dos meus inimigos, unges a minha cabeça com óleo, o meu cálice transborda.'},
    {'number': 6, 'text': 'Certamente que a bondade e a misericórdia me seguirão todos os dias da minha vida; e habitarei na Casa do Senhor por longos dias.'}
]

