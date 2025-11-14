// EventRepository.java
package com.wardvizj.repo;
import com.wardvizj.model.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.*;
public interface EventRepository extends JpaRepository<Event, java.util.UUID> {
  List<Event> findByPatientIdOrderByStartTsAsc(String patientId);
}
