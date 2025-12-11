package fr.fullstack.shopapp.util;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

import fr.fullstack.shopapp.service.ElasticSearchService;

@Component
public class StartupIndexer implements ApplicationRunner {

    // ATTRIBUTES

    private final ElasticSearchService indexService;
    @Value("${elasticsearch.reindex-on-startup}")
    private boolean shouldReindex;

    // CONSTRUCTOR

    public StartupIndexer(ElasticSearchService indexService) {
        this.indexService = indexService;
    }

    // METHODS

    @Override
    public void run(ApplicationArguments args) throws Exception {
        if (shouldReindex) {
            indexService.reindexAll();
        }
    }

}
