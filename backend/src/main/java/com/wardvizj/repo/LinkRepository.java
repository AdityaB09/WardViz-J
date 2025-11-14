// LinkRepository.java
package com.wardvizj.repo;
import com.wardvizj.model.Link;
import com.wardvizj.model.LinkId;
import org.springframework.data.jpa.repository.JpaRepository;
public interface LinkRepository extends JpaRepository<Link, LinkId> {}
