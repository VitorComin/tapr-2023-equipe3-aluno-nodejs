import { Container, SqlQuerySpec } from "@azure/cosmos";
import cosmosDb from "../../common/cosmosdb";
import { Aluno } from "server/interfaces/aluno";
import { DaprClient } from "@dapr/dapr";
import daprClient from "../../common/daprclient";

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
        await this.publishEvent(aluno);

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

        if(alunoAntigo == undefined){
            return Promise.reject();
        }

        alunoAntigo.matricula = aluno.matricula;
        alunoAntigo.nome = aluno.nome;
        alunoAntigo.curso = aluno.curso;
        alunoAntigo.ativo = aluno.ativo;
        await this.container.items.upsert(alunoAntigo)
        await this.publishEvent(alunoAntigo);

        return Promise.resolve(alunoAntigo);
    }

        async delete(id:string): Promise<string>{

        const querySpec: SqlQuerySpec = {
            query: "SELECT * FROM Aluno c WHERE c.id = @id",
            parameters: [
                {name: "@id", value: id}
            ]
            };
        const {resources: listaAluno}
            = await this.container.items.query(querySpec).fetchAll();
        for (const aluno of listaAluno) {
            await this.container.item(aluno.id).delete();
        }
        
        return Promise.resolve(id);

    
        
    }

    async publishEvent(aluno:Aluno): Promise<Aluno>{
        daprClient.pubsub.publish(process.env.APPCOMPONENTSERVICE as string,
                                  process.env.APPCOMPONENTTOPICALUNO as string,
                                  aluno);
        return Promise.resolve(aluno);

    }
}

export default new AlunoService();