import { Container, SqlQuerySpec } from "@azure/cosmos";
import cosmosDb from "../../common/cosmosdb";
import { Aluno } from "server/interfaces/aluno";

class AlunoService{
    private container:Container = 
        cosmosDb.container('aluno');

    async all(): Promise<Aluno[]>{
        const {resources: listaAluno}
            = await this.container.items.readAll<Aluno>().fetchAll();
        
        return Promise.resolve(listaAluno);
    }

    async getById(id: string): Promise<Aluno> {
        const querySpec: SqlQuerySpec = {
            query: "SELECT * FROM Aluno c WHERE c.id = @id",
            parameters: [
                { name: "@id", value: id }
            ]
        };

        const { resources: listaAluno }
            = await this.container.items.query(querySpec).fetchAll();

        return Promise.resolve(listaAluno[0]);
    }

    async saveNew(aluno: Aluno): Promise<Aluno> {
        aluno.id = "";
        await this.container.items.create(aluno);

        return Promise.resolve(aluno);
    }

    async update(id: string, aluno: Aluno): Promise<Aluno> {
        const querySpec: SqlQuerySpec = {
            query: "SELECT * FROM Aluno c WHERE c.id = @id",
            parameters: [
                { name: "@id", value: id }
            ]
        };

        const { resources: listaAluno }
            = await this.container.items.query(querySpec).fetchAll();

        const alunoAntigo = listaAluno[0];

        alunoAntigo.matricula = aluno.matricula;
        alunoAntigo.nome = aluno.nome;
        alunoAntigo.curso = aluno.curso;
        alunoAntigo.ativo = aluno.ativo;
        await this.container.items.upsert(alunoAntigo)

        return Promise.resolve(alunoAntigo);
    }

    async delete(id: string): Promise<string> {
        const querySpec: SqlQuerySpec = {
            query: "SELECT * FROM Aluno c WHERE c.id = @id",
            parameters: [
                { name: "@id", value: id }
            ]
        };

        const { resources: listaAluno }
            = await this.container.items.query(querySpec).fetchAll();
            
        for (const aluno of listaAluno) {
            await this.container.item(aluno.id, aluno.matricula).delete();
        }

        return Promise.resolve(id);
    }
}

export default new AlunoService();