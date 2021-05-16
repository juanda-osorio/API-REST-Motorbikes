import Role from './../models/role.model';

export async function createRoles(){
    try {
        const count = await Role.estimatedDocumentCount();
        if (count > 0) {
            return;
        }
        const rolesCreados = await Promise.all([
            new Role({ name : "user"}).save(),
            new Role({ name : "admin"}).save()
        ]);
        console.log("Roles creados: "+rolesCreados);
    } catch (error) {
        console.log(error);
    }
}