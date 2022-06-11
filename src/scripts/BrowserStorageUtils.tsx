const OWNERSHIPS_KEY = "ownerships"

export interface Ownership {
    "roomId" : string,
    "ownerToken" : string | null,
    "joinerToken" : string | null
}

export function addOwnership(token : string, roomId : string, isOwner : boolean) {
    var rawOwnerships = localStorage.getItem(OWNERSHIPS_KEY)

    var ownership : Ownership
    if(isOwner) {
        ownership = {"roomId" : roomId, "ownerToken" : token, "joinerToken" : null}
    } else {
        ownership = {"roomId" : roomId, "ownerToken" : null, "joinerToken" : token}
    }

    if(rawOwnerships == null) {
        var ownerships = [ownership]
        localStorage.setItem(OWNERSHIPS_KEY, JSON.stringify(ownerships))
        return
    } 

    var fetchedOwnerships : Ownership[] = JSON.parse(rawOwnerships)
    fetchedOwnerships.push(ownership)
    localStorage.setItem(OWNERSHIPS_KEY, JSON.stringify(fetchedOwnerships))
}

export function getTokenForRoom(roomId : string) : string | null {
    const rawOwnerships = localStorage.getItem(OWNERSHIPS_KEY)
    if(rawOwnerships == null) {
        return null
    }
    const ownerships : Ownership[] = JSON.parse(rawOwnerships)
    
    const token = ownerships.find((item) => item.roomId == roomId)
    if(token == undefined) {
        return null
    }
    if(token.joinerToken == null) {
        return token.ownerToken
    }
    return token.joinerToken
}