import { Container, SqlQuerySpec } from "@azure/cosmos";
import cosmosDb from "../../common/cosmosdb";
import { Faculdade } from "../../interfaces/faculdade";

class FaculdadeService{
    
    private container:Container =
        cosmosDb.container("faculdade");

    async updateEvent(faculdade:Faculdade): Promise<Faculdade>{
        await this.container.items.upsert(faculdade);
        return Promise.resolve(faculdade);
    }
    
    async all(): Promise<Faculdade[]>{
        const {resources: listaFaculdade}
            = await this.container.items.readAll<Faculdade>().fetchAll();
        
        return Promise.resolve(listaFaculdade);
    }
    async getById(id:string): Promise<Faculdade>{
        const querySpec: SqlQuerySpec = {
            query: "SELECT * FROM Faculdade c WHERE c.id = @id",
            parameters: [
                {name: "@id", value: id}
            ]
            };
        const {resources: listaFaculdade}
            = await this.container.items.query(querySpec).fetchAll();
        
        return Promise.resolve(listaFaculdade[0]);
    }
    async saveNew(faculdade:Faculdade): Promise<Faculdade>{
        faculdade.id = "";
        await this.container.items.create(faculdade);
        
        return Promise.resolve(faculdade);
    }
    async update(id:string, faculdade:Faculdade): Promise<Faculdade>{
        const querySpec: SqlQuerySpec = {
            query: "SELECT * FROM Faculdade c WHERE c.id = @id",
            parameters: [
                {name: "@id", value: id}
            ]
            };
        const {resources: listaFaculdade}
            = await this.container.items.query(querySpec).fetchAll();
        const faculdadeAntigo = listaFaculdade[0];
        if(faculdadeAntigo == undefined){
            return Promise.reject();
        }
        //Atualizar os campos
        faculdadeAntigo.nome = faculdade.nome;
        faculdadeAntigo.endereco = faculdade.endereco;
        
        await this.container.items.upsert(faculdadeAntigo)
        
        return Promise.resolve(faculdadeAntigo);
    }
    async delete(id:string): Promise<string>{

        const querySpec: SqlQuerySpec = {
            query: "SELECT * FROM Faculdade c WHERE c.id = @id",
            parameters: [
                {name: "@id", value: id}
            ]
            };
        const {resources: listaFaculdade}
            = await this.container.items.query(querySpec).fetchAll();
        for (const faculdade of listaFaculdade) {
            await this.container.item(faculdade.id).delete();
        }
        
        return Promise.resolve(id);
    }
}

export default new FaculdadeService();