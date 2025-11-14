// GuidelineRepository.java
package com.wardvizj.repo;
import com.wardvizj.model.GuidelineResult;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.*;
public interface GuidelineRepository extends JpaRepository<GuidelineResult, java.util.UUID> {
  List<GuidelineResult> findByPatientId(String patientId);
}
