import React from "react";

function TabActions({ action, actions }){
    action = (action.href !== undefined) && <a href={action.href} className={"btn btn-sm btn-"+action.classBtn+" badge"}>{action.title}</a>;
    return(
        <div className="btn-group align-top">
            {action}
            {actions}
        </div>
    )
}

export default TabActions;