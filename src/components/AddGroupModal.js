import React, { useEffect, useState } from 'react'
import group from '../services/group';
import groupService from '../services/group'

function GroupItem({ group, handleAdd }) {

  return (
    <div className='search-group-item'>
      <div className='info'>
        <div className='name'>{group.name}</div>
        <div className='desc'>{group.description}</div>
      </div>
      <div className='btn-wrapper'>
        <button type='button' onClick={() => handleAdd(group.id)}>+</button>
      </div>
    </div>
  );
}

function GroupList({ groups, handleAdd }) {
  return (
    <div className='search-group-list'>
      {groups.length > 0 ? groups.map(group => <GroupItem key={group.id} group={group} handleAdd={handleAdd} />) : null}
    </div>
  );
}

// TODO
function AddGroupModal({ toggle, user, setUser, userGroupPairs, setUserGroupPairs, groups, setGroups, updateGroupMembers }) {
  const [searchValue, setSearchValue] = useState('')
  const [searchResult, setSearchResult] = useState([])
  const onSearch = ({ target }) => {
    setSearchValue(target.value)
  }


  const handleAdd = (groupId) => {
    groupService.addMemberToGroup(groupId, user.id).then((res) => {
      if (res.status === 200) {
        const newPair = {
          'userId': user.id,
          'groupId': groupId,
          'userType': '组员'
        }
        setUserGroupPairs([...userGroupPairs, newPair])
        groupService.getGroupById(groupId).then((res) => {
          const newGroup = res.data
          const newGroups = [...groups, newGroup]
          setGroups(newGroups)
          toggle()
        })
      }
    })
  }

  useEffect(() => {
    if (searchValue) {
      groupService.searchGroups(searchValue).then((res) => {
        setSearchResult(res.data)
      })
    } else {
      // 清空搜索值时也清空搜索结果
      setSearchResult([])
    }
  }, [searchValue])


  return (
    <div id='add-group-modal' className='modal'>
      <div className='modal-header'>
        <div className='modal-title'>加入小组</div>
        <button className="close" onClick={() => toggle()}>&times;</button>
      </div>
      <div className='modal-body'>
        <input type='search' value={searchValue} onChange={onSearch} />
        {searchResult ? <GroupList groups={searchResult} handleAdd={handleAdd} /> : null}
      </div>
    </div>

  )
}

export default AddGroupModal