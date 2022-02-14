import{_ as f,I as b,m as w,D as x,r as d,o as s,b as c,e,h as o,t as h,j as g,w as l,d as _,p as m,i as D,q as T,s as $,f as L}from"./vendor.9d5d7bcf.js";const A={name:"TicketListItem",props:["ticket","agents","types","statuses"],components:{Input:b,Badge:w,Dropdown:x},data(){return{ticketDetailsRefreshed:!1,localTicket:null}},resources:{ticket(){return{method:"helpdesk.api.ticket.get_ticket",params:{ticket_id:this.ticketDetails.name},onSuccess:()=>{this.ticketDetailsRefreshed=!0}}},assignTicketToAgent(){return{method:"helpdesk.api.ticket.assign_ticket_to_agent",debounce:300,onSuccess:()=>{this.$resources.ticket.fetch()}}},assignTicketType(){return{method:"helpdesk.api.ticket.assign_ticket_type",debounce:300,onSuccess:()=>{this.$resources.ticket.fetch()}}},assignTicketStatus(){return{method:"helpdesk.api.ticket.assign_ticket_status",debounce:300,onSuccess:()=>{this.$resources.ticket.fetch()}}}},computed:{ticketDetails(){return this.ticketDetailsRefreshed?(this.ticketDetailsRefreshed=!1,this.localTicket=this.$resources.ticket.data?this.$resources.ticket.data:this.ticket):this.localTicket=this.ticket,this.localTicket}},methods:{getBadgeColorBasedOnStatus(i){if(["Open"].includes(i))return"green";if(["Closed","Resolved"].includes(i))return"red";if(["Replied"].includes(i))return"yellow";if(["On Hold"].includes(i))return"blue"},agentsAsDropdownOptions(){let i=[];return this.agents?(this.agents.forEach(u=>{i.push({label:u.agent_name,handler:()=>{this.$resources.assignTicketToAgent.submit({ticket_id:this.ticketDetails.name,agent_id:u.name})}})}),[{group:"Actions",hideLabel:!0,items:[{label:"Assign to me",handler:()=>{this.$resources.assignTicketToAgent.submit({ticket_id:this.ticketDetails.name})}}]},{items:i}]):null},typesAsDropdownOptions(){let i=[];return this.types?(this.types.forEach(a=>{i.push({label:a,handler:()=>{this.$resources.assignTicketType.submit({ticket_id:this.ticketDetails.name,type:a})}})}),i):null},statusesAsDropdownOptions(){let i=[];return this.statuses?(this.statuses.forEach(a=>{i.push({label:a,handler:()=>{this.$resources.assignTicketStatus.submit({ticket_id:this.ticketDetails.name,status:a})}})}),i):null}}},B={class:"block rounded-md sm:px-2 hover:bg-gray-50"},I={key:0,class:"group flex items-center justify-between sm:justify-start font-light"},S={class:"mr-4"},C=["href"],j={class:"text-base sm:w-3/12"},O=["onClick"],R={key:0},N={key:1,class:"hidden group-hover:block"},V=e("span",{class:"text-sm text-gray-500"}," set type ",-1),E=[V],W={class:"w-full cursor-pointer"},q=["onClick"],F={key:1,class:"hidden group-hover:block"},z=e("span",{class:"text-sm text-gray-500"}," set status ",-1),H=[z],M=["onClick"],U={key:0},G={key:1,class:"hidden group-hover:block"},J=e("span",{class:"text-sm text-gray-500"}," assign agent ",-1),K=[J],P={class:"hidden sm:w-2/12 text-sm text-gray-600 sm:block"},Q=e("div",{class:"transform translate-y-2 border-b"},null,-1);function X(i,a,u,y,v,t){const n=d("Input"),r=d("Dropdown"),p=d("Badge");return s(),c("div",B,[t.ticketDetails?(s(),c("div",I,[e("div",S,[o(n,{type:"checkbox",value:""})]),e("a",{href:"ticket/"+t.ticketDetails.name,class:"text-base sm:w-5/12"},h(t.ticketDetails.subject),9,C),e("div",j,h(t.ticketDetails.contact),1),this.types?(s(),g(r,{key:0,placement:"left",options:t.typesAsDropdownOptions(),"dropdown-width-full":!0,class:"text-base sm:w-2/12"},{default:l(({toggleTypes:k})=>[e("div",{class:"w-full",onClick:k},[t.ticketDetails.ticket_type?(s(),c("div",R,h(t.ticketDetails.ticket_type),1)):(s(),c("div",N,E))],8,O)]),_:1},8,["options"])):_("",!0),this.statuses?(s(),g(r,{key:1,placement:"left",options:t.statusesAsDropdownOptions(),"dropdown-width-full":!0,class:"text-base sm:w-2/12"},{default:l(({toggleStatuses:k})=>[e("div",W,[u.ticket.status?(s(),c("div",{key:0,onClick:k},[o(p,{class:"cursor-pointer",color:t.getBadgeColorBasedOnStatus(t.ticketDetails.status)},{default:l(()=>[m(h(t.ticketDetails.status),1)]),_:1},8,["color"])],8,q)):(s(),c("div",F,H))])]),_:1},8,["options"])):_("",!0),this.agents?(s(),g(r,{key:2,placement:"left",options:t.agentsAsDropdownOptions(),"dropdown-width-full":!0,class:"text-base sm:w-3/12"},{default:l(({toggleAssignees:k})=>[e("div",{class:"w-full",onClick:k},[t.ticketDetails.assignee?(s(),c("div",U,h(t.ticketDetails.assignee),1)):(s(),c("div",G,K))],8,M)]),_:1},8,["options"])):_("",!0),e("div",P,h(t.ticketDetails.modified),1)])):_("",!0),Q])}var Y=f(A,[["render",X]]);const Z={name:"TicketList",inject:["viewportWidth"],props:["ticketList","agents","types","statuses"],components:{Input:b,TicketListItem:Y}},tt={class:"sm:py-1 sm:border sm:border-gray-100 sm:rounded-md sm:shadow sm:px-2"},et={class:"block py-2 rounded-md sm:px-2"},st={class:"block py-1 rounded-md sm:px-2"},it={class:"flex items-center justify-between sm:justify-start font-light"},ct={class:"mr-4"},at=L('<div class="text-base sm:w-5/12"> Subject </div><div class="text-base sm:w-3/12"> Requester </div><div class="text-base sm:w-2/12"> Type </div><div class="text-base sm:w-2/12"> Status </div><div class="text-base sm:w-3/12"> Assignee </div><div class="text-base sm:w-2/12"> Updated </div>',6),ot=e("div",{class:"transform translate-y-2 border-b-2"},null,-1),nt={class:"block py-1 rounded-md sm:px-2"};function rt(i,a,u,y,v,t){const n=d("Input"),r=d("TicketListItem");return s(),c("div",null,[e("div",tt,[e("div",et,[e("div",st,[e("div",it,[e("div",ct,[o(n,{type:"checkbox",value:""})]),at])]),ot]),this.ticketList?(s(),c("div",{key:0,class:"w-full block overflow-auto",style:D({height:t.viewportWidth>768?"calc(100vh - 13rem)":null})},[(s(!0),c(T,null,$(this.ticketList,p=>(s(),c("div",{class:"flex-auto",key:p.name},[e("div",nt,[o(r,{ticket:p,agents:this.agents,types:this.types,statuses:this.statuses},null,8,["ticket","agents","types","statuses"])])]))),128))],4)):_("",!0)])])}var dt=f(Z,[["render",rt]]);const lt={name:"Tickets",inject:["viewportWidth"],components:{TicketList:dt},resources:{tickets(){return{method:"helpdesk.api.ticket.get_tickets",auto:!0}},agents(){return{method:"helpdesk.api.agent.get_all",auto:!0}},types(){return{method:"helpdesk.api.ticket.get_all_ticket_types",auto:!0}},statuses(){return{method:"helpdesk.api.ticket.get_all_ticket_statuses",auto:!0}}},computed:{tickets(){return this.$resources.tickets.data?this.$resources.tickets.data:null},agents(){return this.$resources.agents.data?this.$resources.agents.data:null},types(){return this.$resources.types.data?this.$resources.types.data:null},statuses(){return this.$resources.statuses.data?this.$resources.statuses.data:null}}},ut={class:"flow-root mb-2"},ht=e("p",{class:"float-left text-6xl font-bold"}," Tickets ",-1),_t={class:"float-right mb-4"},kt={class:"flex space-x-3"},pt=m("Add Filter"),mt=m("Last Modified"),ft=m("Add Ticket"),gt={key:0};function yt(i,a,u,y,v,t){const n=d("Button"),r=d("TicketList");return s(),c("div",null,[e("div",null,[e("div",ut,[ht,e("div",_t,[e("div",kt,[o(n,{"icon-left":"filter"},{default:l(()=>[pt]),_:1}),o(n,{"icon-left":"plus"},{default:l(()=>[mt]),_:1}),o(n,{"icon-left":"plus",type:"primary"},{default:l(()=>[ft]),_:1})])])]),t.tickets?(s(),c("div",gt,[o(r,{ticketList:t.tickets,agents:t.agents,types:t.types,statuses:t.statuses},null,8,["ticketList","agents","types","statuses"])])):_("",!0)])])}var bt=f(lt,[["render",yt]]);export{bt as default};
