const OWNERSHIPS_KEYS = "ownerships"

export interface Ownership {
    "roomId" : string,
    "ownerToken" : string | null,
    "joinerToken" : string | null
}

const addOwnership = (token : string, roomId : string, isOwner : boolean) => {
    var rawOwnerships = localStorage.getItem(OWNERSHIPS_KEYS)

    var ownership : Ownership
    if(isOwner) {
        ownership = {"roomId" : roomId, "ownerToken" : token, "joinerToken" : null}
    } else {
        ownership = {"roomId" : roomId, "ownerToken" : null, "joinerToken" : token}
    }

    if(rawOwnerships == null) {
        var ownerships = [ownership]
        localStorage.setItem(OWNERSHIPS_KEYS, JSON.stringify(ownerships))
        return
    } 

    var fetchedOwnerships : Ownership[] = JSON.parse(rawOwnerships)
    fetchedOwnerships.push(ownership)
    localStorage.setItem(OWNERSHIPS_KEYS, JSON.stringify(fetchedOwnerships))
}

export default addOwnership