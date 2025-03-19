let APP_ID ;""

let localStream;
let remoteStream;
let peerConnection;

const servers ={
    iceServers :[
        {
            urls:["stun:stun.l.google.com:19302",
                "stun:stun.l.google.com:5349"]
        }
    ]
}


let init = async () => {
    localStream = await navigator.mediaDevices.getUserMedia({video:true,audio:false})
    document.getElementById('user-1').srcObject = localStream

    createOffer()
}
let createOffer = async ()=> {
    peerConnection = new RTCPeerConnection (servers)
    remoteStream = new MediaStream()
    document.getElementById('user-2').srcObject = remoteStream

    localStream.getTracks().forEach((track) => {
        peerConnection.addTrack(track,localStream)
    })
     
    peerConnection.ontrack = (event) => {
        event.streams[0].getTracks().forEachn((track) => {
            remoteStream.addTrack(track)
        })
    }

    peerConnection.onicecandidate = async (event) => {
        if (event.candidate){
            console.log( 'NEW ICE CANDIDATE',event.candidate)
        }
    }

    let offer = await peerConnection.createOffer()
    await peerConnection.setLocalDescription(offer)
    console.log('Offer:',offer)
}
init()