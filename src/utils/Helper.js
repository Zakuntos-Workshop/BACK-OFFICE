import {Component} from 'react';
import API from '../api/API';
import TabActions from 'components/Tables/TabActions';
import {toast} from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css'; 
import { NavLink } from 'react-router-dom';



class Helper extends Component{

    constructor(props){
        super(props);
		this.api = new API();
		this.state = {
			redirect: null,
            showModal: false
		}


        this.handleOpenModal = this.handleOpenModal.bind(this);
        this.handleCloseModal = this.handleCloseModal.bind(this);       
    }    
    
   handleOpenModal () {
    this.setState({ showModal: true });
  }
  
  handleCloseModal () {
    this.setState({ showModal: false });
  }

    getDataItems = async (root, actions = [],page=1, redirect,actionUrl) =>{
        
        this.setState({redirect:redirect})

        if(page<1) page=1;
        const api = new API();
    
        const { data, total, per_page, current_page, error } = await api.getData(root+'?page='+page);

        const filteredData = [];
        
        if(data != undefined){
            actions = this.setActionsKey(actions, data);
            for (let index = 0; index < data.length; index++) {
                let row = data[index];
                row.is_deleted = row.is_deleted == undefined ? 0 : row.is_deleted;
                row.cover = row.cover !== undefined && <img src={row.cover} width={70} height={70} style={{objectFit: 'scale-down'}}/>;
                row.image = row.image !== undefined && <img src={row.image} width={70} height={70} style={{objectFit: 'scale-down'}}/>;
                row.logo = row.logo !== undefined && <img src={row.logo} width={70} height={70} style={{objectFit: 'cover', borderRadius: "100%"}}/>;
                row.actions = <TabActions action={actions[index]} actions={this.getCrudActions(root, row,redirect,actionUrl)} />;
                filteredData.push(row);
            }
            return { filteredData, total, per_page, current_page, error };
        }else{
            return { filteredData, total:0, per_page, current_page, error };
        }
    }

    delete = async (event,url, redirect) => {
        event.target.classList.add('btn-loading');
        const api = new API();
        const delay = ms => new Promise(res => setTimeout(res, ms));
        const response = await api.getData(url, "DELETE");

        if(response.status == true){
             await toast.info('Suppression reussi', {autoClose:5000})
             await delay(1500);
             event.target.classList.remove('btn-loading');
             this.api.redirect(redirect);
         }else{
             toast.error('Suppression echouée, Ressayer encore', {autoClose:5000})
             event.target.classList.remove('btn-loading');
         }
    }

    setActionsKey = (action, data) => {

        let newActions = [];

        for (let index = 0; index < data.length; index++) {
            let value = data[index];

            const newAction = {
                title: action.title,
                classBtn: action.classBtn,
                href: action.href + '/' + value.id
            };

            newActions.push(newAction);
        }

        return newActions;

    }

    getCrudActions = (root, row,redirect,actionUrl,data) => {

        const user = this.api.getCurrentUser();
        
        let permission;

        if(actionUrl == null) actionUrl = root;
        
        if(user.role.slug == 'marchand'){
            permission = {
                hasRead : 1,
                hasUpdate : 1,
                hasDelete : 1,
            }
        }else{
            permission = this.api.permission(`/${redirect}`);
        }

        return(
            <div> 
                &nbsp;
                {
                    permission?.hasRead === 1 && actionUrl !='delivery_fees' && actionUrl !='rate' && actionUrl !='parrains_config' &&(
                        <NavLink 
                            to={{
                                pathname:`/${actionUrl}/${row.id}`,
                                aboutProps: { title: 'someTitle'}
                            }}
                            exact
                            className="btn btn-sm btn-primary badge">
                                <i className="fa fa-info"></i>
                        </NavLink> 
                    )
                }
                &nbsp;
                 {
                    permission?.hasUpdate === 1 && actionUrl != 'provision' && actionUrl != 'orders' &&(
                        <a href={`/${actionUrl}/edit/${row.id}`} className="btn btn-sm btn-warning badge"><i className="fa fa-edit"></i></a>
                    )
                }
                &nbsp;
                {
                    permission?.hasDelete === 1 && actionUrl !='delivery_fees' && actionUrl !='rate' && actionUrl != 'provision' && actionUrl !='parrains_config' &&(
                        <a href="#" className="btn btn-sm btn-danger badge" data-toggle="modal" data-target={`#modal_${root}_${row.id}`}><i className="fa fa-trash"></i></a>
                    )
                }

                <div className="modal fade" id={`modal_${root}_${row.id}`} tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title text-danger" id="exampleModalLabel">Suppression</h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">X</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <p>Voulez-vous vraiment supprimer cet enregistrement ?</p>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-primary" data-dismiss="modal">Annuler</button>
                                <button onClick={(event)=>this.delete(event,`${actionUrl}/${row.id}`,`${redirect}`)}  className="btn btn-danger">Supprimer</button>
                            </div>
                        </div> 
                    </div>
                </div>
                
            </div>
        )
    }
    
    // getUrlParams = (roots = 1) => {
    //     const root = window.location.pathname;
    //     let rootToArray = root.split('/');
    //     let params = [];

    //     for (let index = roots + 1; index < rootToArray.length; index++) {
    //         const param = rootToArray[index];
    //         params.push(param);
    //     }

    //     return params;
    // }

    getUrlParams = (roots = 1) => {
        const root = window.location.pathname;
        let rootToArray = root.split('/');
    
        if (roots + 1 < rootToArray.length) {
            return rootToArray[roots + 1]; 
        }
    
        return null; 
    }
    

}

export default Helper;