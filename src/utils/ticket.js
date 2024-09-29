import metaUtil from "./meta"
export default {
    mapListData(it) {
        // 项目
        if (it.community) {
            it.communityName = it.community.name

        }

        if (it.organization) {
            // //// console.log(it.organization)
            it.organization = it.organization.name
        }
        // 内容
        if (it.contents) {
            it.images = it.contents.map(item => {
                return item.files
            }).join(",").split(",")
            it.content = it.contents.map(item => { return item.content }).join(",")
        }

        if (it.initiator) {
            // .filter(item=>{return item.userType =="OWNER"})
            it.initiatorName = it.initiator.map(item => { return item.name }).join(",")
            it.employeeMobile = it.initiator.map(item => { return item.employeeMobile }).join(",")
            it.userMobile = it.initiator.map(item => { return item.userMobile }).join(",")
            if (it.employeeMobile != ',' && it.employeeMobile != '') {
                it.initiatorMobile = it.employeeMobile
            } else {
                it.initiatorMobile = it.userMobile
            }
        }
        if (it.initiator) {
            //  .filter(item=>{return item.userType =="OWNER"})

        }
        // 受理人
        if (it.assignee) {
            it.assigneeName = it.assignee.map(item => { return item.name }).join(",")
            it.assigneeMobile = it.assignee.map(it => {
                return it.employeeMobile
            }).join(",")
        }

        // 常住人
        if (it.propertyUsers) {
            it.resident = it.propertyUsers.filter(it => { return it.status == 'ACTIVE' })
            it.residentName = it.resident.filter(item => { return item.type != "OWNER" }).map(item => { return item.name }).join(",")
        }
        // 产权人
        if (it.propertyUsers) {
            it.name = it.propertyUsers.filter(item => { return item.type == "OWNER" }).map(item => { return item.name }).join(",")
            it.mobile = it.propertyUsers.filter(item => { return item.type == "OWNER" }).map(item => { return item.mobile }).join(",")
            it.propertyUsers = it.propertyUsers.filter(it => { return it.status == 'ACTIVE' })
        }
        // 业主
        if (it.propertyUsers) {
            it.propertyUsersName = it.propertyUsers.map(item => { return item.name }).join(",")
        }
        // 图片反馈
        if (it.feedback) {
            it.feedback.map(item => {
                item.images = item.files.split(",")
            })
        }


        if (it.cc) {
            it.ccName = it.cc.map(item => { return item.name }).join(",")
        }
        if (it.handler) {
            it.progress = it.handler.filter(item => { return item.status == 'FINISHED' }).length + "/" + it.handler.length
        }
        if (it.handler) {
            it.handlerName = it.handler.filter(item => { return item.status !== 'DISABLED' }).map(item => {
                return item.name
            }).join(",")
            it.handlerMobile = it.handler.map(it => {
                return it.employeeMobile
            }).join(",")
        }
        if (it.initiator) {
            it.house = it.initiator.map(item => {
                return item.building + "栋" + item.unit + "单元" + item.floor + item.doorNo
            }).join(",")
        }
        if (it.houseName) {
            it.houseNumber = it.houseName.name
        }
        if (it.manager) {
            it.managerName = it.manager.name
        }
        if (it.employee) {
            it.employeeName = it.employee.name
        }
        it.typeName = it.type && it.type.name || ""
        // //// console.log(it)
        return it
    },
    mapListMeta(it) {
        return it
    },
    tranformMeta(meta, key, targetKey) {
        metaUtil.updateMeta(meta, key, (it) => {
            // //// console.log(it)
            it.displayInList = true;
            if (targetKey) {
                it.key = targetKey
                //   //// console.log(it)
            }
            // //// console.log(it)
            return it
        })
    },
    sortList(meta) {
        for (let key in arguments) {
            if (key == 0) {
                continue
            }
            let propertyKey = arguments[key]
            meta.subs = meta.subs.map(it => {
                if (it.key === propertyKey) {
                    it.sort = key
                }
                return it;
            })
        }
    }

}