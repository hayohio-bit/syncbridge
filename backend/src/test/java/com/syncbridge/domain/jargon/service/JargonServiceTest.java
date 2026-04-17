package com.syncbridge.domain.jargon.service;

import com.syncbridge.domain.jargon.dto.JargonTranslationResponse;
import com.syncbridge.domain.jargon.entity.JargonHit;
import com.syncbridge.domain.jargon.entity.JargonTerm;
import com.syncbridge.domain.jargon.entity.JargonTranslation;
import com.syncbridge.domain.jargon.repository.JargonHitRepository;
import com.syncbridge.domain.jargon.repository.JargonTermRepository;
import com.syncbridge.domain.jargon.repository.JargonTranslationRepository;
import com.syncbridge.domain.user.entity.Role;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.*;

@ExtendWith(MockitoExtension.class)
class JargonServiceTest {

    @Mock
    private JargonTermRepository jargonTermRepository;

    @Mock
    private JargonTranslationRepository jargonTranslationRepository;

    @Mock
    private JargonHitRepository jargonHitRepository;

    @Mock
    private AiTranslationService aiTranslationService;

    @InjectMocks
    private JargonService jargonService;

    @Test
    void getAllKeywords_returnsKeywordList() {
        given(jargonTermRepository.findAllKeywords()).willReturn(List.of("API", "스프린트"));

        List<String> keywords = jargonService.getAllKeywords();

        assertThat(keywords).containsExactly("API", "스프린트");
    }

    @Test
    void translate_withMatchingRole_returnsTranslation() {
        JargonTerm term = mock(JargonTerm.class);
        given(term.getId()).willReturn(1L);
        given(term.getKeyword()).willReturn("API");

        JargonTranslation translation = JargonTranslation.builder()
                .jargonTerm(term)
                .targetRole(Role.PLANNER)
                .easyDefinition("앱과 앱을 연결하는 창구")
                .businessImpact("기획자 영향: 서비스 간 데이터 흐름 이해 필요")
                .build();

        given(jargonTermRepository.findByKeywordAndIsDeletedFalse("API")).willReturn(Optional.of(term));
        given(jargonHitRepository.save(any(JargonHit.class))).willReturn(mock(JargonHit.class));
        given(jargonTranslationRepository.findByJargonTermIdAndTargetRoleAndIsDeletedFalse(1L, Role.PLANNER))
                .willReturn(Optional.of(translation));

        JargonTranslationResponse response = jargonService.translate("API", "PLANNER", 1L);

        assertThat(response.getKeyword()).isEqualTo("API");
        assertThat(response.getEasyDefinition()).isEqualTo("앱과 앱을 연결하는 창구");
        assertThat(response.getBusinessImpact()).isEqualTo("기획자 영향: 서비스 간 데이터 흐름 이해 필요");
    }

    @Test
    void translate_noRoleTranslation_fallsBackToGeneral() {
        JargonTerm term = mock(JargonTerm.class);
        given(term.getId()).willReturn(2L);
        given(term.getKeyword()).willReturn("스프린트");

        JargonTranslation generalTranslation = JargonTranslation.builder()
                .jargonTerm(term)
                .targetRole(Role.GENERAL)
                .easyDefinition("짧은 기간 동안 집중해서 목표를 달성하는 개발 방식")
                .businessImpact(null)
                .build();

        given(jargonTermRepository.findByKeywordAndIsDeletedFalse("스프린트")).willReturn(Optional.of(term));
        given(jargonHitRepository.save(any(JargonHit.class))).willReturn(mock(JargonHit.class));
        given(jargonTranslationRepository.findByJargonTermIdAndTargetRoleAndIsDeletedFalse(2L, Role.DESIGNER))
                .willReturn(Optional.empty());
        given(jargonTranslationRepository.findByJargonTermIdAndTargetRoleAndIsDeletedFalse(2L, Role.GENERAL))
                .willReturn(Optional.of(generalTranslation));

        JargonTranslationResponse response = jargonService.translate("스프린트", "DESIGNER", 1L);

        assertThat(response.getEasyDefinition()).isEqualTo("짧은 기간 동안 집중해서 목표를 달성하는 개발 방식");
    }

    @Test
    void translate_termNotFound_createsTermAndCallsAi() {
        JargonTerm newTerm = mock(JargonTerm.class);
        given(newTerm.getId()).willReturn(5L);
        given(newTerm.getKeyword()).willReturn("없는용어");

        JargonTranslation aiTranslation = JargonTranslation.builder()
                .jargonTerm(newTerm)
                .targetRole(Role.PLANNER)
                .easyDefinition("AI가 생성한 설명")
                .businessImpact("AI가 생성한 영향도")
                .build();

        given(jargonTermRepository.findByKeywordAndIsDeletedFalse("없는용어")).willReturn(Optional.empty());
        given(jargonTermRepository.save(any(JargonTerm.class))).willReturn(newTerm);
        given(jargonHitRepository.save(any(JargonHit.class))).willReturn(mock(JargonHit.class));
        given(jargonTranslationRepository.findByJargonTermIdAndTargetRoleAndIsDeletedFalse(5L, Role.PLANNER))
                .willReturn(Optional.empty());
        given(jargonTranslationRepository.findByJargonTermIdAndTargetRoleAndIsDeletedFalse(5L, Role.GENERAL))
                .willReturn(Optional.empty());
        given(aiTranslationService.generateTranslation("없는용어", Role.PLANNER))
                .willReturn(Map.of("easyDefinition", "AI가 생성한 설명", "businessImpact", "AI가 생성한 영향도"));
        given(jargonTranslationRepository.save(any(JargonTranslation.class))).willReturn(aiTranslation);

        JargonTranslationResponse response = jargonService.translate("없는용어", "PLANNER", 1L);

        assertThat(response.getEasyDefinition()).isEqualTo("AI가 생성한 설명");
        then(jargonTermRepository).should().save(any(JargonTerm.class));
        then(aiTranslationService).should().generateTranslation("없는용어", Role.PLANNER);
    }

    @Test
    void translate_noTranslationForRoleOrGeneral_callsAiAndCaches() {
        JargonTerm term = mock(JargonTerm.class);
        given(term.getId()).willReturn(4L);
        given(term.getKeyword()).willReturn("마이그레이션");

        JargonTranslation aiTranslation = JargonTranslation.builder()
                .jargonTerm(term)
                .targetRole(Role.FRONTEND)
                .easyDefinition("데이터를 새 시스템으로 옮기는 작업")
                .businessImpact("프론트엔드 영향: API 엔드포인트 변경 가능성")
                .build();

        given(jargonTermRepository.findByKeywordAndIsDeletedFalse("마이그레이션")).willReturn(Optional.of(term));
        given(jargonHitRepository.save(any(JargonHit.class))).willReturn(mock(JargonHit.class));
        given(jargonTranslationRepository.findByJargonTermIdAndTargetRoleAndIsDeletedFalse(4L, Role.FRONTEND))
                .willReturn(Optional.empty());
        given(jargonTranslationRepository.findByJargonTermIdAndTargetRoleAndIsDeletedFalse(4L, Role.GENERAL))
                .willReturn(Optional.empty());
        given(aiTranslationService.generateTranslation("마이그레이션", Role.FRONTEND))
                .willReturn(Map.of("easyDefinition", "데이터를 새 시스템으로 옮기는 작업",
                        "businessImpact", "프론트엔드 영향: API 엔드포인트 변경 가능성"));
        given(jargonTranslationRepository.save(any(JargonTranslation.class))).willReturn(aiTranslation);

        JargonTranslationResponse response = jargonService.translate("마이그레이션", "FRONTEND", 1L);

        assertThat(response.getEasyDefinition()).isEqualTo("데이터를 새 시스템으로 옮기는 작업");
        then(aiTranslationService).should().generateTranslation("마이그레이션", Role.FRONTEND);
        then(jargonTranslationRepository).should().save(any(JargonTranslation.class));
    }
}
