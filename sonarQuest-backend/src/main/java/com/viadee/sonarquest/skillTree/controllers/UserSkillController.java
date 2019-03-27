package com.viadee.sonarquest.skillTree.controllers;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.viadee.sonarquest.entities.Artefact;
import com.viadee.sonarquest.skillTree.dto.skillTreeDiagram.SkillTreeDiagramDTO;
import com.viadee.sonarquest.skillTree.dto.skillTreeDiagram.SkillTreeLinksDTO;
import com.viadee.sonarquest.skillTree.dto.skillTreeDiagram.SkillTreeObjectDTO;
import com.viadee.sonarquest.skillTree.entities.UserSkill;
import com.viadee.sonarquest.skillTree.entities.UserSkillGroup;
import com.viadee.sonarquest.skillTree.repositories.UserSkillRepositroy;
import com.viadee.sonarquest.skillTree.services.UserSkillService;

@RestController
@RequestMapping("/userskill")
public class UserSkillController {

    @Autowired
    private UserSkillRepositroy userSkillRepository;
    
    @Autowired
    private UserSkillService userSkillService;

    

    @GetMapping
    public List<UserSkill> getAllUserSkills() {
        return userSkillRepository.findAll();
    }
    
    @GetMapping(value="/roots/")
    public List<UserSkill> getAllRootUserSkills() {
        return userSkillRepository.findAllRootUserSkills(true);
    }
    
    
    @GetMapping(value = "/tree/fromgroup/{id}")
	public SkillTreeDiagramDTO getGroupSkillTree(@PathVariable(value = "id") final Long id) {
		List<UserSkill> userSkills = userSkillRepository.findUserSkillsByGroup(id);
		SkillTreeDiagramDTO skillTreeDiagramDTO = new SkillTreeDiagramDTO();

		for (UserSkill userSkill : userSkills) {
			skillTreeDiagramDTO.addNode(new SkillTreeObjectDTO(String.valueOf(userSkill.getId()), String.valueOf(userSkill.getName())));
			for (UserSkill followingUserSkill : userSkill.getFollowingUserSkills()) {
				skillTreeDiagramDTO
						.addLine(new SkillTreeLinksDTO(String.valueOf(userSkill.getId()), String.valueOf(followingUserSkill.getId())));
			}
		}
		return skillTreeDiagramDTO;

	}
           
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public UserSkill createUserSkill() {
        return userSkillService.createUserSkill(new UserSkill("testbeschreibug","testname",false, null));
    }
    
    @DeleteMapping(value = "/{id}")
    public HttpStatus deleteUser(@PathVariable(value = "id") final Long id) {
        if(userSkillService.delete(id)) {
            return HttpStatus.OK;
        }
        return HttpStatus.NOT_FOUND;
    }
}